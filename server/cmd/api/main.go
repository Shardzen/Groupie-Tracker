package main

import (
	"groupie-tracker/internal/database"
	"groupie-tracker/internal/handlers"
	"groupie-tracker/internal/middleware"
	"groupie-tracker/internal/models"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// @title Groupie Tracker API
// @version 1.0
// @description API REST pour Groupie Tracker Avancé
// @host localhost:8080
// @BasePath /api/v1
func main() {
	// Connexion à la base de données
	if err := database.Connect(); err != nil {
		log.Fatal("Database connection failed:", err)
	}

	// Auto-migration des modèles
	if err := database.AutoMigrate(
		&models.User{},
		&models.Artist{},
		&models.Location{},
		&models.Concert{},
		&models.Favorite{},
	); err != nil {
		log.Fatal("Auto-migration failed:", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router := mux.NewRouter()

	// Middleware global
	router.Use(middleware.LoggingMiddleware)

	// Health check
	router.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","message":"Server is running"}`))
	}).Methods("GET")

	// API routes
	api := router.PathPrefix("/api/v1").Subrouter()

	// Routes publiques (Auth)
	api.HandleFunc("/auth/register", handlers.Register).Methods("POST")
	api.HandleFunc("/auth/login", handlers.Login).Methods("POST")

	// Routes publiques (Artists - lecture seule)
	api.HandleFunc("/artists", handlers.GetArtists).Methods("GET")
	api.HandleFunc("/artists/{id}", handlers.GetArtist).Methods("GET")

	// Routes publiques (Concerts - lecture seule)
	api.HandleFunc("/concerts", handlers.GetConcerts).Methods("GET")
	api.HandleFunc("/concerts/{id}", handlers.GetConcert).Methods("GET")

	// Routes protégées (authentification requise)
	protected := api.PathPrefix("").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	// User routes
	protected.HandleFunc("/auth/me", handlers.GetMe).Methods("GET")

	// Favorites routes
	protected.HandleFunc("/favorites", handlers.GetFavorites).Methods("GET")
	protected.HandleFunc("/favorites", handlers.AddFavorite).Methods("POST")
	protected.HandleFunc("/favorites/{artistId}", handlers.RemoveFavorite).Methods("DELETE")

	// Admin routes (création/modification/suppression)
	protected.HandleFunc("/artists", handlers.CreateArtist).Methods("POST")
	protected.HandleFunc("/artists/{id}", handlers.UpdateArtist).Methods("PUT")
	protected.HandleFunc("/artists/{id}", handlers.DeleteArtist).Methods("DELETE")

	protected.HandleFunc("/concerts", handlers.CreateConcert).Methods("POST")

	// Configuration CORS
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	})

	handler := c.Handler(router)

	log.Printf("🚀 Server starting on port %s", port)
	log.Printf("📚 API Documentation: http://localhost:%s/api/v1", port)
	log.Printf("💚 Health Check: http://localhost:%s/health", port)

	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatal(err)
	}
}
