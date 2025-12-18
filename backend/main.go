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
)

type Artist struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Image        string   `json:"image"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
}

type Concert struct {
	ID       int       `json:"id"`
	ArtistID int       `json:"artistId"`
	Location string    `json:"location"`
	Date     time.Time `json:"date"`
	Price    float64   `json:"price"`
	Tickets  int       `json:"tickets"`
}

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"-"`
}

var (
	artists  = []Artist{}
	concerts = []Concert{}
	users    = []User{}
)

func main() {
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
	artists = []Artist{
		{ID: 1, Name: "Queen", Image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400", Members: []string{"Freddie Mercury", "Brian May", "Roger Taylor", "John Deacon"}, CreationDate: 1970, FirstAlbum: "07-13-1973"},
		{ID: 2, Name: "Pink Floyd", Image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400", Members: []string{"David Gilmour", "Roger Waters", "Nick Mason", "Richard Wright"}, CreationDate: 1965, FirstAlbum: "08-05-1967"},
		{ID: 3, Name: "Led Zeppelin", Image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400", Members: []string{"Robert Plant", "Jimmy Page", "John Paul Jones", "John Bonham"}, CreationDate: 1968, FirstAlbum: "01-12-1969"},
		{ID: 4, Name: "The Beatles", Image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400", Members: []string{"John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"}, CreationDate: 1960, FirstAlbum: "03-22-1963"},
		{ID: 5, Name: "Nirvana", Image: "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400", Members: []string{"Kurt Cobain", "Krist Novoselic", "Dave Grohl"}, CreationDate: 1987, FirstAlbum: "06-15-1989"},
	}

	concerts = []Concert{
		{ID: 1, ArtistID: 1, Location: "Paris, France", Date: time.Now().AddDate(0, 2, 0), Price: 89.99, Tickets: 150},
		{ID: 2, ArtistID: 1, Location: "London, UK", Date: time.Now().AddDate(0, 3, 5), Price: 95.50, Tickets: 200},
		{ID: 3, ArtistID: 2, Location: "Berlin, Germany", Date: time.Now().AddDate(0, 1, 15), Price: 110.00, Tickets: 100},
		{ID: 4, ArtistID: 3, Location: "New York, USA", Date: time.Now().AddDate(0, 4, 0), Price: 120.00, Tickets: 250},
		{ID: 5, ArtistID: 4, Location: "Tokyo, Japan", Date: time.Now().AddDate(0, 5, 10), Price: 130.00, Tickets: 180},
		{ID: 6, ArtistID: 5, Location: "Los Angeles, USA", Date: time.Now().AddDate(0, 2, 20), Price: 75.00, Tickets: 120},
	}
}

func getArtists(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artists)
}

func getArtist(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	for _, artist := range artists {
		if artist.ID == id {
			json.NewEncoder(w).Encode(artist)
			return
		}
	}
	http.Error(w, "Artist not found", http.StatusNotFound)
}

func getConcerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(concerts)
}

func searchConcerts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	query := strings.ToLower(r.URL.Query().Get("q"))

	var results []Concert
	for _, concert := range concerts {
		if query == "" || strings.Contains(strings.ToLower(concert.Location), query) {
			results = append(results, concert)
		}
	}
	json.NewEncoder(w).Encode(results)
}

func register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var user User
	json.NewDecoder(r.Body).Decode(&user)

	user.ID = len(users) + 1
	users = append(users, user)

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
	json.NewDecoder(r.Body).Decode(&credentials)

	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"token":   "mock-jwt-token-" + credentials.Email,
		"user": map[string]interface{}{
			"email": credentials.Email,
			"id":    1,
		},
	})
}

func healthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
