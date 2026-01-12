package handlers

import (
	"encoding/json"
	"groupie-tracker/internal/database"
	"groupie-tracker/internal/models"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type AddFavoriteRequest struct {
	ArtistID uint `json:"artistId"`
}

// GetFavorites retourne les favoris de l'utilisateur connecté
func GetFavorites(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)

	var favorites []models.Favorite
	if err := database.DB.Preload("Artist").Where("user_id = ?", userID).Find(&favorites).Error; err != nil {
		http.Error(w, `{"error":"Failed to fetch favorites"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(favorites)
}

// AddFavorite ajoute un artiste aux favoris
func AddFavorite(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)

	var req AddFavoriteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"Invalid request body"}`, http.StatusBadRequest)
		return
	}

	// Vérifier si l'artiste existe
	var artist models.Artist
	if err := database.DB.First(&artist, req.ArtistID).Error; err != nil {
		http.Error(w, `{"error":"Artist not found"}`, http.StatusNotFound)
		return
	}

	// Vérifier si déjà en favoris
	var existing models.Favorite
	if err := database.DB.Where("user_id = ? AND artist_id = ?", userID, req.ArtistID).First(&existing).Error; err == nil {
		http.Error(w, `{"error":"Artist already in favorites"}`, http.StatusConflict)
		return
	}

	// Créer le favori
	favorite := models.Favorite{
		UserID:   userID,
		ArtistID: req.ArtistID,
	}

	if err := database.DB.Create(&favorite).Error; err != nil {
		http.Error(w, `{"error":"Failed to add favorite"}`, http.StatusInternalServerError)
		return
	}

	// Charger l'artiste
	database.DB.Preload("Artist").First(&favorite, favorite.ID)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(favorite)
}

// RemoveFavorite retire un artiste des favoris
func RemoveFavorite(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("userID").(uint)
	vars := mux.Vars(r)
	artistID, err := strconv.Atoi(vars["artistId"])
	if err != nil {
		http.Error(w, `{"error":"Invalid artist ID"}`, http.StatusBadRequest)
		return
	}

	result := database.DB.Where("user_id = ? AND artist_id = ?", userID, artistID).Delete(&models.Favorite{})
	if result.Error != nil {
		http.Error(w, `{"error":"Failed to remove favorite"}`, http.StatusInternalServerError)
		return
	}

	if result.RowsAffected == 0 {
		http.Error(w, `{"error":"Favorite not found"}`, http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
