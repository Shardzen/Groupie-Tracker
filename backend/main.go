package main

import (

	"log"
	"net/http"
	"os"
	"strings"	
	"groupie-backend/database"
	"groupie-backend/handlers"
	"groupie-backend/middleware"
	"groupie-backend/storage" 
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"golang.org/x/time/rate"
	"groupie-backend/services"
)

// Rate limiter: 5 requests per second with burst of 10
var limiter = rate.NewLimiter(rate.Limit(5), 10)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Attention : Fichier .env non trouvé, vérification des variables système...")
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("❌ ERREUR CRITIQUE : La variable DATABASE_URL est vide ! Vérifie que ton fichier s'appelle bien '.env'.")
	}

	handlers.InitOAuth()

	if err := database.InitDB(); err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	defer database.CloseDB()
	
	services.StartUnverifiedUserCleanup(database.DB)
	
	storage.InitMinIO()

	r := mux.NewRouter()
	
	r.HandleFunc("/api/health", handlers.HealthCheck).Methods("GET")

	api := r.PathPrefix("/api").Subrouter()
	api.Use(rateLimitMiddleware)
    api.Use(securityHeadersMiddleware)

	api.HandleFunc("/artists", handlers.GetArtists).Methods("GET")
	api.HandleFunc("/artists/{id}", handlers.GetArtist).Methods("GET")
	api.HandleFunc("/concerts", handlers.GetConcerts).Methods("GET")
	api.HandleFunc("/concerts/search", handlers.SearchConcerts).Methods("GET")
	
	// Deezer integration (remplace Spotify)
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

	admin.HandleFunc("/artists", handlers.AdminGetArtists).Methods("GET")
	admin.HandleFunc("/artists", handlers.AdminCreateArtist).Methods("POST")
	admin.HandleFunc("/artists/{id}", handlers.AdminUpdateArtist).Methods("PUT")
	admin.HandleFunc("/artists/{id}", handlers.AdminDeleteArtist).Methods("DELETE")

	admin.HandleFunc("/concerts", handlers.AdminGetConcerts).Methods("GET")
	admin.HandleFunc("/concerts", handlers.AdminCreateConcert).Methods("POST")
	admin.HandleFunc("/concerts/{id}", handlers.AdminUpdateConcert).Methods("PUT")
	admin.HandleFunc("/concerts/{id}", handlers.AdminDeleteConcert).Methods("DELETE")

	admin.HandleFunc("/payments", handlers.AdminGetPayments).Methods("GET")
	admin.HandleFunc("/users", handlers.AdminGetUsers).Methods("GET")

	api.HandleFunc("/stripe/webhook", handlers.StripeWebhook).Methods("POST")

	c := cors.New(cors.Options{
		AllowedOrigins:   getAllowedOrigins(),
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	})

	handler := c.Handler(r)

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
		// Enhanced Content Security Policy
        w.Header().Set("Content-Security-Policy", 
			"default-src 'self'; "+
			"img-src 'self' data: https: *.amazonaws.com *.cloudfront.net; "+
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; "+
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "+
			"font-src 'self' https://fonts.gstatic.com; "+
			"frame-src 'self' *.deezer.com *.stripe.com; "+
			"connect-src 'self' *.stripe.com *.deezer.com")
		
		// Additional security headers
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
	log.Println("🎸 YNOV - Groupie Tracker API v2.0")
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
	log.Println("🛡️  Admin Endpoints:")
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
	log.Println("🎵 ========================================")
}
