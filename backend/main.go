package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time" // Added for sentry.Flush

	"groupie-backend/database"
	"groupie-backend/handlers"
	"groupie-backend/middleware"
	"groupie-backend/storage"

	"github.com/getsentry/sentry-go"       // Sentry SDK
	sentryhttp "github.com/getsentry/sentry-go/http" // Sentry HTTP middleware
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/stripe/stripe-go/v76"
	"golang.org/x/time/rate"
)

var limiter = rate.NewLimiter(rate.Limit(5), 10)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Attention : Fichier .env non trouvé, vérification des variables système...")
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("❌ ERREUR CRITIQUE : La variable DATABASE_URL est vide ! Vérifie que ton fichier s'appelle bien '.env'.")
	}

	// --- Initialisation de Sentry ---
	sentryDSN := os.Getenv("SENTRY_DSN")
	if sentryDSN != "" {
		err = sentry.Init(sentry.ClientOptions{
			Dsn:              sentryDSN,
			EnableTracing:    true, // Enable tracing for performance monitoring
			TracesSampleRate: 1.0,  // Capture 100% of transactions for now
			// Debug:            true, // Uncomment to enable Sentry debug logs
			Environment: os.Getenv("APP_ENV"), // 'production', 'development' etc.
		})
		if err != nil {
			log.Fatalf("❌ Sentry initialization failed: %v", err)
		}
		defer sentry.Flush(2 * time.Second) // Flush buffered events before exiting
		log.Println("✅ Sentry initialized")
	} else {
		log.Println("⚠️  SENTRY_DSN est vide. Sentry ne sera pas initialisé.")
	}

	// --- Initialisation de Stripe ---
	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeKey == "" {
		log.Println("⚠️  ATTENTION : STRIPE_SECRET_KEY est vide dans le .env. Les paiements ne fonctionneront pas.")
	} else {
		stripe.Key = stripeKey
		log.Println("💳 Stripe configuré avec succès")
	}

	handlers.InitOAuth()

	if err := database.InitDB(); err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	defer database.CloseDB()

	storage.InitMinIO()

	// --- Démarrer les tâches planifiées ---
	StartCleanupScheduler()
	StartStatsLogger()

	r := mux.NewRouter()

	r.HandleFunc("/api/health", handlers.HealthCheck).Methods("GET")

	api := r.PathPrefix("/api").Subrouter()
	api.Use(rateLimitMiddleware)
	api.Use(securityHeadersMiddleware)

	api.HandleFunc("/artists", handlers.GetArtists).Methods("GET")
	api.HandleFunc("/artists/{id}", handlers.GetArtist).Methods("GET")
	api.HandleFunc("/concerts", handlers.GetConcerts).Methods("GET")
	api.HandleFunc("/concerts/search", handlers.SearchConcerts).Methods("GET")

	deezerHandler := handlers.NewDeezerHandler()
	api.HandleFunc("/deezer/widget", deezerHandler.GetArtistDeezerWidget).Methods("GET")

	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/register", handlers.Register).Methods("POST")
	auth.HandleFunc("/login", handlers.Login).Methods("POST")
	auth.HandleFunc("/google", handlers.GoogleLogin).Methods("GET")
	auth.HandleFunc("/google/callback", handlers.GoogleCallback).Methods("GET")
	auth.HandleFunc("/request-password-reset", handlers.RequestPasswordReset).Methods("POST")
	auth.HandleFunc("/reset-password", handlers.ResetPassword).Methods("POST")
	auth.HandleFunc("/send-verification", handlers.SendVerificationEmail).Methods("POST")
	auth.HandleFunc("/verify-email", handlers.VerifyEmail).Methods("GET")

	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.JWTAuth)
	protected.HandleFunc("/profile", handlers.GetProfile).Methods("GET")
	protected.HandleFunc("/bookings", handlers.CreateBooking).Methods("POST")

	// Routes de paiement (Protégées par JWT, sauf le webhook qui est public)
	payment := protected.PathPrefix("/payment").Subrouter()
	payment.HandleFunc("/create-intent", handlers.CreatePaymentIntent).Methods("POST")
	payment.HandleFunc("/confirm", handlers.ConfirmPayment).Methods("POST")
	payment.HandleFunc("/reservations", handlers.GetReservations).Methods("GET")

	aiRouter := protected.PathPrefix("/ai").Subrouter()
	aiRouter.HandleFunc("/recommend", handlers.AIRecommendation).Methods("POST")
	aiRouter.HandleFunc("/search", handlers.AISearch).Methods("POST")

	admin := protected.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.AdminOnly)

	admin.HandleFunc("/upload", handlers.AdminUploadImage).Methods("POST")

	// Dashboard & Analytics
	admin.HandleFunc("/dashboard", handlers.AdminGetDashboard).Methods("GET")
	admin.HandleFunc("/activity-logs", handlers.AdminGetActivityLogs).Methods("GET")

	// Artists CRUD
	admin.HandleFunc("/artists", handlers.AdminGetArtists).Methods("GET")
	admin.HandleFunc("/artists", handlers.AdminCreateArtist).Methods("POST")
	admin.HandleFunc("/artists/{id}", handlers.AdminUpdateArtist).Methods("PUT")
	admin.HandleFunc("/artists/{id}", handlers.AdminDeleteArtist).Methods("DELETE")

	// Concerts CRUD
	admin.HandleFunc("/concerts", handlers.AdminGetConcerts).Methods("GET")
	admin.HandleFunc("/concerts", handlers.AdminCreateConcert).Methods("POST")
	admin.HandleFunc("/concerts/{id}", handlers.AdminUpdateConcert).Methods("PUT")
	admin.HandleFunc("/concerts/{id}", handlers.AdminDeleteConcert).Methods("DELETE")

	// Users & Payments
	admin.HandleFunc("/payments", handlers.AdminGetPayments).Methods("GET")
	admin.HandleFunc("/users", handlers.AdminGetUsers).Methods("GET")

	// Webhook Stripe (Doit rester PUBLIC, sans JWT)
	api.HandleFunc("/stripe/webhook", handlers.StripeWebhook).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   getAllowedOrigins(),
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Stripe-Signature"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	handler := c.Handler(r)

	// Wrap the handler with Sentry HTTP middleware IF Sentry is initialized
	if sentryDSN != "" { // Use the same condition as initialization
		sentryHandler := sentryhttp.New(sentryhttp.Options{}).Handle(handler)
		log.Println("✅ Sentry HTTP middleware enabled")
		handler = sentryHandler
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	printServerInfo(port)

	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, handler))
}

func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !limiter.Allow() {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error":"Too many requests. Please slow down."}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func securityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Security-Policy",
			"default-src 'self'; "+
				"img-src 'self' data: https: *.amazonaws.com *.cloudfront.net; "+
				"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; "+
				"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "+
				"font-src 'self' https://fonts.gstatic.com; "+
				"frame-src 'self' *.deezer.com *.stripe.com https://js.stripe.com; "+
				"connect-src 'self' *.stripe.com *.deezer.com")

		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		next.ServeHTTP(w, r)
	})
}

func getAllowedOrigins() []string {
	originsEnv := os.Getenv("ALLOWED_ORIGINS")

	if originsEnv != "" {
		origins := strings.Split(originsEnv, ",")
		for i, origin := range origins {
			origins[i] = strings.TrimSpace(origin)
		}
		return origins
	}

	return []string{
		"http://localhost:5173",
		"http://localhost:3000",
		"http://127.0.0.1:5173",
		"http://127.0.0.1:3000",
	}
}

func printServerInfo(port string) {
	log.Println("🎵 ========================================")
	log.Println("🎸 YNOV - Groupie Tracker API v2.0 + STRIPE")
	log.Println("🎵 ========================================")
	log.Printf("🚀 Server running on: http://localhost:%s", port)
	log.Printf("🏥 Health check: http://localhost:%s/api/health", port)
	log.Println("")
	log.Println("📍 Public Endpoints:")
	log.Printf("   🎤 Artists: /api/artists")
	log.Printf("   🎫 Concerts: /api/concerts")
	log.Printf("   🎵 Deezer Widget: /api/deezer/widget")
	log.Println("")
	log.Println("🔐 Auth Endpoints:")
	log.Printf("   📧 Register: /api/auth/register")
	log.Printf("   🔑 Login: /api/auth/login")
	log.Printf("   🔵 Google OAuth: /api/auth/google")
	log.Printf("   🔄 Password Reset: /api/auth/request-password-reset")
	log.Printf("   ✉️  Email Verification: /api/auth/send-verification")
	log.Println("")
	log.Println("👤 Protected Endpoints:")
	log.Printf("   👤 Profile: /api/profile")
	log.Printf("   💳 Payment: /api/payment/*")
	log.Printf("   🤖 AI: /api/ai/*")
	log.Println("")
	log.Println("💳 Stripe Endpoints:")
	log.Printf("   💰 Create Intent: POST /api/payment/create-intent")
	log.Printf("   ✅ Confirm Payment: POST /api/payment/confirm")
	log.Printf("   📋 Reservations: GET /api/payment/reservations")
	log.Printf("   🪝 Webhook: POST /api/stripe/webhook")
	log.Println("")
	log.Println("🛡️  Admin Endpoints:")
	log.Printf("   📊 Dashboard: /api/admin/dashboard")
	log.Printf("   📝 Activity Logs: /api/admin/activity-logs")
	log.Printf("   🎤 Artists CRUD: /api/admin/artists")
	log.Printf("   🎫 Concerts CRUD: /api/admin/concerts")
	log.Printf("   💰 Payments: /api/admin/payments")
	log.Printf("   👥 Users: /api/admin/users")
	log.Printf("   ☁️  Upload: /api/admin/upload")
	log.Println("")
	log.Println("🔒 Security:")
	log.Printf("   ⚡ Rate Limit: 5 req/s (burst 10)")
	log.Printf("   🛡️  Security Headers: Enhanced")
	log.Printf("   🌐 CORS: %v", getAllowedOrigins())
	log.Println("")
	log.Println("🧹 Background Tasks:")
	log.Printf("   ♻️  Cleanup expired reservations: Every 5 minutes")
	log.Printf("   📊 Stats logging: Every hour")
	log.Println("🎵 ========================================")
}
