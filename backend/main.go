package main

import (
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"groupie-backend/database"
	"groupie-backend/handlers"
	"groupie-backend/internal/auth"
	"groupie-backend/middleware"
	"groupie-backend/storage"

	"github.com/getsentry/sentry-go"
	sentryhttp "github.com/getsentry/sentry-go/http"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"github.com/stripe/stripe-go/v76"
	"golang.org/x/time/rate"
	"groupie-backend/services"
)

var limiter = rate.NewLimiter(rate.Limit(5), 10)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Attention : Fichier .env non trouvé")
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("❌ ERREUR CRITIQUE : La variable DATABASE_URL est vide !")
	}

	// --- Initialisations ---
	sentryDSN := os.Getenv("SENTRY_DSN")
	if sentryDSN != "" {
		sentry.Init(sentry.ClientOptions{
			Dsn:              sentryDSN,
			EnableTracing:    true,
			TracesSampleRate: 1.0,
			Environment:      os.Getenv("APP_ENV"),
		})
		defer sentry.Flush(2 * time.Second)
		log.Println("✅ Sentry initialized")
	}

	stripeKey := os.Getenv("STRIPE_SECRET_KEY")
	if stripeKey != "" {
		stripe.Key = stripeKey
		log.Println("💳 Stripe configuré")
	}

	auth.InitJWT()
	handlers.InitOAuth() 

	if err := database.InitDB(); err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	defer database.CloseDB()

	services.StartUnverifiedUserCleanup(database.DB)
	storage.InitMinIO()

	// --- Routeur Principal ---
	r := mux.NewRouter()

	r.HandleFunc("/api/health", handlers.HealthCheck).Methods("GET")

	// --- Routeur API ---
	api := r.PathPrefix("/api").Subrouter()
	api.Use(rateLimitMiddleware)
	api.Use(securityHeadersMiddleware)

	// Routes Publiques
	api.HandleFunc("/artists", handlers.GetArtists).Methods("GET")
	api.HandleFunc("/artists/{id}", handlers.GetArtist).Methods("GET")
	api.HandleFunc("/concerts", handlers.GetConcerts).Methods("GET")
	api.HandleFunc("/concerts/search", handlers.SearchConcerts).Methods("GET")

	deezerHandler := handlers.NewDeezerHandler()
	api.HandleFunc("/deezer/widget", deezerHandler.GetArtistDeezerWidget).Methods("GET")

	// --- ROUTES AUTHENTIFICATION ---
	authRouter := api.PathPrefix("/auth").Subrouter()
	
	// Routes Email/Password
	authRouter.HandleFunc("/register", handlers.Register).Methods("POST")
	authRouter.HandleFunc("/login", handlers.Login).Methods("POST")
	authRouter.HandleFunc("/request-password-reset", handlers.ForgotPassword).Methods("POST")
	authRouter.HandleFunc("/reset-password", handlers.ResetPassword).Methods("POST")
	authRouter.HandleFunc("/send-verification", handlers.ResendVerification).Methods("POST")
	authRouter.HandleFunc("/verify-email", handlers.VerifyEmail).Methods("GET")
	
	// Routes OAuth Google
	authRouter.HandleFunc("/google", handlers.GoogleLogin).Methods("GET", "OPTIONS")
	authRouter.HandleFunc("/google/callback", handlers.GoogleCallback).Methods("GET", "OPTIONS")

	// --- ROUTES PROTÉGÉES ---
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.JWTAuth)
	protected.HandleFunc("/profile", handlers.GetProfile).Methods("GET")
	protected.HandleFunc("/bookings", handlers.CreateBooking).Methods("POST")

	// Paiement
	payment := protected.PathPrefix("/payment").Subrouter()
	payment.HandleFunc("/create-intent", handlers.CreatePaymentIntent).Methods("POST")
	payment.HandleFunc("/confirm", handlers.ConfirmPayment).Methods("POST")
	payment.HandleFunc("/reservations", handlers.GetReservations).Methods("GET")

	// Admin
	admin := protected.PathPrefix("/admin").Subrouter()
	admin.Use(middleware.AdminOnly)
	admin.HandleFunc("/upload", handlers.AdminUploadImage).Methods("POST")
	admin.HandleFunc("/dashboard", handlers.AdminGetDashboard).Methods("GET")
	admin.HandleFunc("/artists", handlers.AdminGetArtists).Methods("GET")
	admin.HandleFunc("/artists", handlers.AdminCreateArtist).Methods("POST")

	// Webhook Stripe (Public)
	api.HandleFunc("/stripe/webhook", handlers.StripeWebhook).Methods("POST")

	// --- CORS ---
	c := cors.New(cors.Options{
		AllowedOrigins:   getAllowedOrigins(),
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Stripe-Signature"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)
	if sentryDSN != "" {
		handler = sentryhttp.New(sentryhttp.Options{}).Handle(handler)
	}

	port := os.Getenv("PORT")
	if port == "" { 
		port = "8080" 
	}

	log.Printf("🚀 Server running on: http://localhost:%s", port)
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, handler))
}

// --- Middlewares ---

func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !limiter.Allow() {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusTooManyRequests)
			w.Write([]byte(`{"error":"Too many requests"}`))
			return
		}
		next.ServeHTTP(w, r)
	})
}

func securityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		next.ServeHTTP(w, r)
	})
}

func getAllowedOrigins() []string {
	originsEnv := os.Getenv("ALLOWED_ORIGINS")
	if originsEnv != "" {
		return strings.Split(originsEnv, ",")
	}
	return []string{"http://localhost:5173"}
}
