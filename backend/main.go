package main

import (
	"log"
	"net/http"
	"os"

	"groupie-backend/database"
	"groupie-backend/handlers"
	"groupie-backend/middleware"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
)

func main() {
	godotenv.Load()

	if err := database.InitDB(); err != nil {
		log.Fatalf("❌ Failed to initialize database: %v", err)
	}
	defer database.CloseDB()

	r := mux.NewRouter()

	// Health check endpoint (no CORS needed, but included for consistency)
	r.HandleFunc("/api/health", handlers.HealthCheck).Methods("GET")

	// API routes
	api := r.PathPrefix("/api").Subrouter()
	api.HandleFunc("/artists", handlers.GetArtists).Methods("GET")
	api.HandleFunc("/artists/{id}", handlers.GetArtist).Methods("GET")
	api.HandleFunc("/concerts", handlers.GetConcerts).Methods("GET")
	api.HandleFunc("/concerts/search", handlers.SearchConcerts).Methods("GET")

	// Auth routes
	auth := api.PathPrefix("/auth").Subrouter()
	auth.HandleFunc("/register", handlers.Register).Methods("POST")
	auth.HandleFunc("/login", handlers.Login).Methods("POST")
	auth.HandleFunc("/google", handlers.GoogleOAuth).Methods("POST")

	// Protected routes
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.JWTAuth)
	protected.HandleFunc("/profile", handlers.GetProfile).Methods("GET")
	protected.HandleFunc("/bookings", handlers.CreateBooking).Methods("POST")

	// Payment routes
	payment := protected.PathPrefix("/payment").Subrouter()
	payment.HandleFunc("/create-intent", handlers.CreatePaymentIntent).Methods("POST")
	payment.HandleFunc("/confirm", handlers.ConfirmPayment).Methods("POST")
	payment.HandleFunc("/reservations", handlers.GetReservations).Methods("GET")

	// AI routes
	aiRouter := protected.PathPrefix("/ai").Subrouter()
	aiRouter.HandleFunc("/recommend", handlers.AIRecommendation).Methods("POST")

	// Webhook (no auth required)
	api.HandleFunc("/stripe/webhook", handlers.StripeWebhook).Methods("POST")

	// CORS Configuration - Enhanced for Frontend
	c := cors.New(cors.Options{
		AllowedOrigins: getOrigins(),
		AllowedMethods: []string{
			http.MethodGet,
			http.MethodPost,
			http.MethodPut,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowedHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
		},
		ExposedHeaders: []string{
			"Link",
		},
		AllowCredentials: true,
		MaxAge:           300, // 5 minutes cache for preflight requests
	})

	handler := c.Handler(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Println("🎵 ========================================")
	log.Println("🎸 YNOT - Groupie Tracker API")
	log.Println("🎵 ========================================")
	log.Printf("🚀 Server running on: http://localhost:%s", port)
	log.Printf("🏥 Health check: http://localhost:%s/api/health", port)
	log.Printf("🎤 Artists: http://localhost:%s/api/artists", port)
	log.Printf("🎫 Concerts: http://localhost:%s/api/concerts", port)
	log.Printf("🔐 Auth: /api/auth/register, /api/auth/login")
	log.Printf("💳 Payment: /api/payment/*")
	log.Printf("🤖 AI: /api/ai/recommend")
	log.Println("🎵 ========================================")

	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func getOrigins() []string {
	origins := os.Getenv("ALLOWED_ORIGINS")
	if origins == "" {
		// Default development origins
		return []string{
			"http://localhost:5173",
			"http://localhost:3000",
			"http://127.0.0.1:5173",
			"http://127.0.0.1:3000",
		}
	}
	return []string{origins}
}
