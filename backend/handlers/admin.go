package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"groupie-backend/database"
	"groupie-backend/middleware"
	"groupie-backend/models"

	"github.com/gorilla/mux"
)

// ============================
// ADMIN - ARTISTS CRUD
// ============================

func AdminGetArtists(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	rows, err := database.DB.Query(`
		SELECT id, name, image, members, creation_date, first_album, locations, concert_dates, relations
		FROM artists
		ORDER BY name
	`)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}
	defer rows.Close()

	artists := []models.Artist{}
	for rows.Next() {
		var artist models.Artist
		var membersJSON, locationsJSON, datesJSON, relationsJSON string
		err := rows.Scan(&artist.ID, &artist.Name, &artist.Image, &membersJSON,
			&artist.CreationDate, &artist.FirstAlbum, &locationsJSON,
			&datesJSON, &relationsJSON)
		if err != nil {
			continue
		}
		json.Unmarshal([]byte(membersJSON), &artist.Members)
		json.Unmarshal([]byte(locationsJSON), &artist.Locations)
		json.Unmarshal([]byte(datesJSON), &artist.ConcertDates)
		json.Unmarshal([]byte(relationsJSON), &artist.Relations)
		artists = append(artists, artist)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artists)
}

func AdminCreateArtist(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	var artist models.Artist
	if err := json.NewDecoder(r.Body).Decode(&artist); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	membersJSON, _ := json.Marshal(artist.Members)
	locationsJSON, _ := json.Marshal(artist.Locations)
	datesJSON, _ := json.Marshal(artist.ConcertDates)
	relationsJSON, _ := json.Marshal(artist.Relations)

	err := database.DB.QueryRow(`
		INSERT INTO artists (name, image, members, creation_date, first_album, locations, concert_dates, relations)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id
	`, artist.Name, artist.Image, string(membersJSON), artist.CreationDate,
		artist.FirstAlbum, string(locationsJSON), string(datesJSON), string(relationsJSON)).Scan(&artist.ID)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create artist"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(artist)
}

func AdminUpdateArtist(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid artist ID"})
		return
	}

	var artist models.Artist
	if err := json.NewDecoder(r.Body).Decode(&artist); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	membersJSON, _ := json.Marshal(artist.Members)
	locationsJSON, _ := json.Marshal(artist.Locations)
	datesJSON, _ := json.Marshal(artist.ConcertDates)
	relationsJSON, _ := json.Marshal(artist.Relations)

	_, err = database.DB.Exec(`
		UPDATE artists 
		SET name=$1, image=$2, members=$3, creation_date=$4, first_album=$5, 
		    locations=$6, concert_dates=$7, relations=$8
		WHERE id=$9
	`, artist.Name, artist.Image, string(membersJSON), artist.CreationDate,
		artist.FirstAlbum, string(locationsJSON), string(datesJSON), string(relationsJSON), id)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update artist"})
		return
	}

	artist.ID = id
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(artist)
}

func AdminDeleteArtist(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid artist ID"})
		return
	}

	_, err = database.DB.Exec("DELETE FROM artists WHERE id=$1", id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to delete artist"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Artist deleted successfully"})
}

// ============================
// ADMIN - CONCERTS CRUD
// ============================

func AdminGetConcerts(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	rows, err := database.DB.Query(`
		SELECT c.id, c.artist_id, c.location, c.date, c.available_tickets, c.price,
		       a.name as artist_name, a.image as artist_image
		FROM concerts c
		LEFT JOIN artists a ON c.artist_id = a.id
		ORDER BY c.date DESC
	`)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}
	defer rows.Close()

	concerts := []models.Concert{}
	for rows.Next() {
		var concert models.Concert
		var artistName, artistImage string
		err := rows.Scan(&concert.ID, &concert.ArtistID, &concert.Location, &concert.Date,
			&concert.AvailableTickets, &concert.Price, &artistName, &artistImage)
		if err != nil {
			continue
		}
		concert.ArtistName = artistName
		concert.ArtistImage = artistImage
		concerts = append(concerts, concert)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(concerts)
}

func AdminCreateConcert(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	var concert models.Concert
	if err := json.NewDecoder(r.Body).Decode(&concert); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	err := database.DB.QueryRow(`
		INSERT INTO concerts (artist_id, location, date, available_tickets, price)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`, concert.ArtistID, concert.Location, concert.Date, concert.AvailableTickets, concert.Price).Scan(&concert.ID)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create concert"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(concert)
}

func AdminUpdateConcert(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid concert ID"})
		return
	}

	var concert models.Concert
	if err := json.NewDecoder(r.Body).Decode(&concert); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	_, err = database.DB.Exec(`
		UPDATE concerts 
		SET artist_id=$1, location=$2, date=$3, available_tickets=$4, price=$5
		WHERE id=$6
	`, concert.ArtistID, concert.Location, concert.Date, concert.AvailableTickets, concert.Price, id)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update concert"})
		return
	}

	concert.ID = id
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(concert)
}

func AdminDeleteConcert(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid concert ID"})
		return
	}

	_, err = database.DB.Exec("DELETE FROM concerts WHERE id=$1", id)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to delete concert"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Concert deleted successfully"})
}

// ============================
// ADMIN - PAYMENTS & USERS
// ============================

func AdminGetPayments(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	rows, err := database.DB.Query(`
		SELECT r.id, r.user_id, r.concert_id, r.tickets, r.total_price, 
		       r.payment_status, r.payment_intent, r.created_at,
		       u.name as user_name, u.email as user_email,
		       c.location as concert_location, c.date as concert_date,
		       a.name as artist_name
		FROM reservations r
		LEFT JOIN users u ON r.user_id = u.id
		LEFT JOIN concerts c ON r.concert_id = c.id
		LEFT JOIN artists a ON c.artist_id = a.id
		ORDER BY r.created_at DESC
	`)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}
	defer rows.Close()

	payments := []map[string]interface{}{}
	for rows.Next() {
		var id, userID, concertID, tickets int
		var totalPrice float64
		var paymentStatus, paymentIntent, userName, userEmail, concertLocation, concertDate, artistName string
		var createdAt string

		err := rows.Scan(&id, &userID, &concertID, &tickets, &totalPrice, &paymentStatus,
			&paymentIntent, &createdAt, &userName, &userEmail, &concertLocation, &concertDate, &artistName)
		if err != nil {
			continue
		}

		payment := map[string]interface{}{
			"id":               id,
			"user_id":          userID,
			"user_name":        userName,
			"user_email":       userEmail,
			"concert_id":       concertID,
			"concert_location": concertLocation,
			"concert_date":     concertDate,
			"artist_name":      artistName,
			"tickets":          tickets,
			"total_price":      totalPrice,
			"payment_status":   paymentStatus,
			"payment_intent":   paymentIntent,
			"created_at":       createdAt,
		}
		payments = append(payments, payment)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payments)
}

func AdminGetUsers(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || !claims.IsAdmin {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	rows, err := database.DB.Query(`
		SELECT id, name, email, is_admin, email_verified, created_at,
		       (SELECT COUNT(*) FROM reservations WHERE user_id = users.id) as total_bookings
		FROM users
		ORDER BY created_at DESC
	`)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}
	defer rows.Close()

	users := []map[string]interface{}{}
	for rows.Next() {
		var id int
		var name, email, createdAt string
		var isAdmin, emailVerified bool
		var totalBookings int

		err := rows.Scan(&id, &name, &email, &isAdmin, &emailVerified, &createdAt, &totalBookings)
		if err != nil {
			continue
		}

		user := map[string]interface{}{
			"id":             id,
			"name":           name,
			"email":          email,
			"is_admin":       isAdmin,
			"email_verified": emailVerified,
			"created_at":     createdAt,
			"total_bookings": totalBookings,
		}
		users = append(users, user)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
