package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"groupie-backend/services"

	"github.com/gorilla/mux"
)

var artistService = services.NewArtistService()

func GetArtists(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	artists := artistService.GetAll()
	json.NewEncoder(w).Encode(artists)
}

func GetArtist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, "Invalid artist ID", http.StatusBadRequest)
		return
	}

	artist, found := artistService.GetByID(id)
	if !found {
		http.Error(w, "Artist not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(artist)
}

func GetConcerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	concerts := artistService.GetAllConcerts()
	json.NewEncoder(w).Encode(concerts)
}

func SearchConcerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	query := r.URL.Query().Get("q")
	concerts := artistService.SearchConcerts(query)
	json.NewEncoder(w).Encode(concerts)
}
