package handlers

import (
	"encoding/json"
	"groupie-tracker/internal/database"
	"groupie-tracker/internal/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// GetArtists retourne tous les artistes
func GetArtists(w http.ResponseWriter, r *http.Request) {
	var artists []models.Artist

	// Paramètres de recherche optionnels
	query := r.URL.Query().Get("q")
	genre := r.URL.Query().Get("genre")

	db := database.DB

	if query != "" {
		db = db.Where("name ILIKE ?", "%"+query+"%")
	}

	if genre != "" {
		db = db.Where("genre = ?", genre)
	}

	if err := db.Find(&artists).Error; err != nil {
		http.Error(w, `{"error":"Failed to fetch artists"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artists)
}

// GetArtist retourne un artiste par ID
func GetArtist(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error":"Invalid artist ID"}`, http.StatusBadRequest)
		return
	}

	var artist models.Artist
	if err := database.DB.First(&artist, id).Error; err != nil {
		http.Error(w, `{"error":"Artist not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artist)
}

// CreateArtist crée un nouvel artiste (Admin only)
func CreateArtist(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value("role").(string)
	if role != "admin" {
		http.Error(w, `{"error":"Forbidden: Admin access required"}`, http.StatusForbidden)
		return
	}

	var artist models.Artist
	if err := json.NewDecoder(r.Body).Decode(&artist); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if err := database.DB.Create(&artist).Error; err != nil {
		http.Error(w, `{"error":"Failed to create artist"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(artist)
}

// UpdateArtist met à jour un artiste (Admin only)
func UpdateArtist(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value("role").(string)
	if role != "admin" {
		http.Error(w, `{"error":"Forbidden: Admin access required"}`, http.StatusForbidden)
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error":"Invalid artist ID"}`, http.StatusBadRequest)
		return
	}

	var artist models.Artist
	if err := database.DB.First(&artist, id).Error; err != nil {
		http.Error(w, `{"error":"Artist not found"}`, http.StatusNotFound)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&artist); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	if err := database.DB.Save(&artist).Error; err != nil {
		http.Error(w, `{"error":"Failed to update artist"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artist)
}

// DeleteArtist supprime un artiste (Admin only)
func DeleteArtist(w http.ResponseWriter, r *http.Request) {
	role := r.Context().Value("role").(string)
	if role != "admin" {
		http.Error(w, `{"error":"Forbidden: Admin access required"}`, http.StatusForbidden)
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, `{"error":"Invalid artist ID"}`, http.StatusBadRequest)
		return
	}

	if err := database.DB.Delete(&models.Artist{}, id).Error; err != nil {
		http.Error(w, `{"error":"Failed to delete artist"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
