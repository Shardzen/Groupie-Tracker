package main

import (
	"log"
	"net/http"
	"os"
	"strings"

	"groupie-backend/storage"

	"groupie-backend/database"
	"groupie-backend/handlers"
	"groupie-backend/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"golang.org/x/time/rate"
)

var limiter = rate.NewLimiter(rate.Limit(10), 20)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("⚠️  Attention : Fichier .env non trouvé, vérification des variables système...")
	}

	if os.Getenv("DATABASE_URL") == "" {
		log.Fatal("❌ ERREUR CRITIQUE : La variable DATABASE_URL est vide ! Vérifie que ton fichier s'appelle bien '.env' et pas '.env.txt'.")
	}
	

	handlers.InitOAuth()

	if err := database.InitDB(); err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	defer database.CloseDB()


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

	admin.HandleFunc("/artists", handlers.AdminGetArtists).Methods("GET")
	admin.HandleFunc("/artists", handlers.AdminCreateArtist).Methods("POST")
	admin.HandleFunc("/artists/{id}", handlers.AdminUpdateArtist).Methods("PUT")
	admin.HandleFunc("/artists/{id}", handlers.AdminDeleteArtist).Methods("DELETE")
    admin := protected.PathPrefix("/admin").Subrouter()
    admin.Use(middleware.AdminOnly)

    
    admin.HandleFunc("/upload", handlers.AdminUploadImage).Methods("POST") 

    admin.HandleFunc("/artists", handlers.AdminGetArtists).Methods("GET")
    

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

	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func rateLimitMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !limiter.Allow() {
			http.Error(w, `{"error":"Rate limit exceeded. Please try again later."}`, http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func securityHeadersMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		w.Header().Set("Content-Security-Policy", "default-src 'self'")
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
	log.Println("")
	log.Println("🔒 Security:")
	log.Printf("   ⚡ Rate Limit: 10 req/s (burst 20)")
	log.Printf("   🛡️  Security Headers: Enabled")
	log.Printf("   🌐 CORS: %v", getAllowedOrigins())
	log.Println("🎵 ========================================")
}