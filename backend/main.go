package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/gorm"
)

var (
	artists  = []Artist{}
	concerts = []Concert{}
	users    = []User{}
)

func main() {
	InitDB()
	initMockData()

	r := mux.NewRouter()

	r.HandleFunc("/api/artists", getArtists).Methods("GET")
	r.HandleFunc("/api/artists/{id}", getArtist).Methods("GET")
	r.HandleFunc("/api/concerts", getConcerts).Methods("GET")
	r.HandleFunc("/api/concerts/search", searchConcerts).Methods("GET")
	r.HandleFunc("/api/auth/register", register).Methods("POST")
	r.HandleFunc("/api/auth/login", login).Methods("POST")
	r.HandleFunc("/api/health", healthCheck).Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	})

	handler := c.Handler(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func initMockData() {
	// Check if data already exists
	var count int64
	DB.Model(&Artist{}).Count(&count)
	if count > 0 {
		return // Data already seeded
	}

	// Create artists
	artists := []Artist{
		{Name: "Queen", ImageURL: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", CreationDate: 1970, FirstAlbum: "07-13-1973"},
		{Name: "Pink Floyd", ImageURL: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400", CreationDate: 1965, FirstAlbum: "08-05-1967"},
		{Name: "Led Zeppelin", ImageURL: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", CreationDate: 1968, FirstAlbum: "01-12-1969"},
		{Name: "The Beatles", ImageURL: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400", CreationDate: 1960, FirstAlbum: "03-22-1963"},
		{Name: "Nirvana", ImageURL: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400", CreationDate: 1987, FirstAlbum: "06-15-1989"},
	}

	for i := range artists {
		DB.Create(&artists[i])
	}

	// Create artist members
	members := [][]ArtistMember{
		{
			{ArtistID: artists[0].ID, Name: "Freddie Mercury", Role: "Lead Vocals", Order: 1},
			{ArtistID: artists[0].ID, Name: "Brian May", Role: "Guitar", Order: 2},
			{ArtistID: artists[0].ID, Name: "Roger Taylor", Role: "Drums", Order: 3},
			{ArtistID: artists[0].ID, Name: "John Deacon", Role: "Bass", Order: 4},
		},
		{
			{ArtistID: artists[1].ID, Name: "David Gilmour", Role: "Guitar", Order: 1},
			{ArtistID: artists[1].ID, Name: "Roger Waters", Role: "Bass", Order: 2},
			{ArtistID: artists[1].ID, Name: "Nick Mason", Role: "Drums", Order: 3},
			{ArtistID: artists[1].ID, Name: "Richard Wright", Role: "Keyboards", Order: 4},
		},
		{
			{ArtistID: artists[2].ID, Name: "Robert Plant", Role: "Lead Vocals", Order: 1},
			{ArtistID: artists[2].ID, Name: "Jimmy Page", Role: "Guitar", Order: 2},
			{ArtistID: artists[2].ID, Name: "John Paul Jones", Role: "Bass", Order: 3},
			{ArtistID: artists[2].ID, Name: "John Bonham", Role: "Drums", Order: 4},
		},
		{
			{ArtistID: artists[3].ID, Name: "John Lennon", Role: "Guitar", Order: 1},
			{ArtistID: artists[3].ID, Name: "Paul McCartney", Role: "Bass", Order: 2},
			{ArtistID: artists[3].ID, Name: "George Harrison", Role: "Guitar", Order: 3},
			{ArtistID: artists[3].ID, Name: "Ringo Starr", Role: "Drums", Order: 4},
		},
		{
			{ArtistID: artists[4].ID, Name: "Kurt Cobain", Role: "Lead Vocals", Order: 1},
			{ArtistID: artists[4].ID, Name: "Krist Novoselic", Role: "Bass", Order: 2},
			{ArtistID: artists[4].ID, Name: "Dave Grohl", Role: "Drums", Order: 3},
		},
	}

	for _, memberList := range members {
		for _, member := range memberList {
			DB.Create(&member)
		}
	}

	// Create concerts
	concerts := []Concert{
		{ArtistID: artists[0].ID, Location: "Paris, France", City: "Paris", Country: "France", Date: time.Now().AddDate(0, 2, 0), Price: 89.99, TotalTickets: 150, AvailableTickets: 150},
		{ArtistID: artists[0].ID, Location: "London, UK", City: "London", Country: "UK", Date: time.Now().AddDate(0, 3, 5), Price: 95.50, TotalTickets: 200, AvailableTickets: 200},
		{ArtistID: artists[1].ID, Location: "Berlin, Germany", City: "Berlin", Country: "Germany", Date: time.Now().AddDate(0, 1, 15), Price: 110.00, TotalTickets: 100, AvailableTickets: 100},
		{ArtistID: artists[2].ID, Location: "New York, USA", City: "New York", Country: "USA", Date: time.Now().AddDate(0, 4, 0), Price: 120.00, TotalTickets: 250, AvailableTickets: 250},
		{ArtistID: artists[3].ID, Location: "Tokyo, Japan", City: "Tokyo", Country: "Japan", Date: time.Now().AddDate(0, 5, 10), Price: 130.00, TotalTickets: 180, AvailableTickets: 180},
		{ArtistID: artists[4].ID, Location: "Los Angeles, USA", City: "Los Angeles", Country: "USA", Date: time.Now().AddDate(0, 2, 20), Price: 75.00, TotalTickets: 120, AvailableTickets: 120},
	}

	for _, concert := range concerts {
		DB.Create(&concert)
	}

	log.Println("Mock data seeded successfully")
}

func getArtists(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var artists []Artist
	if err := DB.Preload("Members").Find(&artists).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(artists)
}

func getArtist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var artist Artist
	if err := DB.Preload("Members").First(&artist, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Artist not found", http.StatusNotFound)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(artist)
}

func getConcerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var concerts []Concert
	if err := DB.Preload("Artist").Find(&concerts).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(concerts)
}

func searchConcerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	query := strings.ToLower(r.URL.Query().Get("q"))

	var results []Concert
	var err error
	if query == "" {
		err = DB.Preload("Artist").Find(&results).Error
	} else {
		err = DB.Preload("Artist").Where("LOWER(location) LIKE ?", "%"+query+"%").Find(&results).Error
	}
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(results)
}

func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Check if user already exists
	var existingUser User
	if err := DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		http.Error(w, "User already exists", http.StatusConflict)
		return
	}

	if err := DB.Create(&user).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"message": "User registered successfully",
		"userId":  user.ID,
	})
}

func login(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var credentials struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var user User
	if err := DB.Where("email = ? AND password_hash = ?", credentials.Email, credentials.Password).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"token":   "mock-jwt-token-" + user.Email,
		"user": map[string]interface{}{
			"email": user.Email,
			"id":    user.ID,
		},
	})
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
