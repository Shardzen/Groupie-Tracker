package handlers

import (
	"encoding/json"
	"groupie-tracker/internal/database"
	"groupie-tracker/internal/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

// GetConcerts retourne tous les concerts
func GetConcerts(w http.ResponseWriter, r *http.Request) {
	var concerts []models.Concert

	db := database.DB.Preload("Artist").Preload("Location")

	// Filtres optionnels
	artistID := r.URL.Query().Get("artistId")
	city := r.URL.Query().Get("city")
	fromDate := r.URL.Query().Get("from")
	toDate := r.URL.Query().Get("to")

	if artistID != "" {
		db = db.Where("artist_id = ?", artistID)
	}

	if city != "" {
		db = db.Joins("JOIN locations ON concerts.location_id = locations.id").
			Where("locations.city ILIKE ?", "%"+city+"%")
	}

	if fromDate != "" {
		if date, err := time.Parse("2006-01-02", fromDate); err == nil {
			db = db.Where("date >= ?", date)
		}
	}

	if toDate != "" {
		if date, err := time.Parse("2006-01-02", toDate); err == nil {
			db = db.Where("date <= ?", date)
		}
	}

	if err := db.Find(&concerts).Error; err != nil {
		http.Error(w, `{"error":"Failed to fetch concerts"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(concerts)
}

// GetConcert retourne un concert par ID
func GetConcert(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error":"Invalid concert ID"}`, http.StatusBadRequest)
		return
	}

	var concert models.Concert
	if err := database.DB.Preload("Artist").Preload("Location").First(&concert, id).Error; err != nil {
		http.Error(w, `{"error":"Concert not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(concert)
}

// CreateConcert crée un nouveau concert (Admin only)
func CreateConcert(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value("role").(string)
	if role != "admin" {
		http.Error(w, `{"error":"Forbidden: Admin access required"}`, http.StatusForbidden)
		return
	}

	var concert models.Concert
	if err := json.NewDecoder(r.Body).Decode(&concert); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if err := database.DB.Create(&concert).Error; err != nil {
		http.Error(w, `{"error":"Failed to create concert"}`, http.StatusInternalServerError)
		return
	}

	database.DB.Preload("Artist").Preload("Location").First(&concert, concert.ID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(concert)
}
