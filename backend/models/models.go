package models

import "time"

type Artist struct {
	ID           int                 `json:"id"`
	Name         string              `json:"name"`
	Image        string              `json:"image"`
	Bio          string              `json:"bio,omitempty"`
	Members      []string            `json:"members"`
	CreationDate int                 `json:"creationDate"`
	FirstAlbum   string              `json:"firstAlbum"`
	Locations    []string            `json:"locations"`
	ConcertDates []string            `json:"concertDates"`
	Relations    map[string][]string `json:"relations"`
}

type User struct {
	ID           int       `json:"id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	Name         string    `json:"name"`
	Role         string    `json:"role"`
	CreatedAt    time.Time `json:"created_at"`
}

type Concert struct {
	ID                int       `json:"id"`
	Name              string    `json:"name,omitempty"`
	ArtistName        string    `json:"artist_name,omitempty"`
	ArtistImage       string    `json:"artist_image,omitempty"`
	ArtistID          int       `json:"artist_id"`
	Venue             string    `json:"venue,omitempty"`
	Location          string    `json:"location"`
	City              string    `json:"city,omitempty"`
	Date              time.Time `json:"date"`
	ImageURL          string    `json:"image_url,omitempty"`
	Price             float64   `json:"price"`
	StandardPrice     float64   `json:"standard_price,omitempty"`
	VIPPrice          float64   `json:"vip_price,omitempty"`
	AvailableTickets  int       `json:"available_tickets"`
	AvailableStandard int       `json:"available_standard,omitempty"`
	AvailableVIP      int       `json:"available_vip,omitempty"`
	CreatedAt         time.Time `json:"created_at,omitempty"`
}

type Reservation struct {
	ID                    int       `json:"id"`
	UserID                int       `json:"user_id"`
	ConcertID             int       `json:"concert_id"`
	
	// --- AJOUT POUR CORRIGER L'ERREUR ---
	ConcertName           string    `json:"concert_name,omitempty"`
	// ------------------------------------

	TicketType            string    `json:"ticket_type"`
	Quantity              int       `json:"quantity"`
	Tickets               int       `json:"tickets,omitempty"`
	TotalPrice            float64   `json:"total_price"`
	Status                string    `json:"status"`
	PaymentStatus         string    `json:"payment_status,omitempty"`
	PaymentIntent         string    `json:"payment_intent,omitempty"`
	StripePaymentIntentID string    `json:"stripe_payment_intent_id,omitempty"`
	StripePaymentStatus   string    `json:"stripe_payment_status,omitempty"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at,omitempty"`
}

type RegisterRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

type CreatePaymentIntentRequest struct {
	ConcertID  int    `json:"concert_id"`
	TicketType string `json:"ticket_type"`
	Quantity   int    `json:"quantity"`
}

type CreatePaymentIntentResponse struct {
	ClientSecret string  `json:"client_secret"`
	Amount       float64 `json:"amount"`
}

type ConfirmPaymentRequest struct {
	PaymentIntentID string `json:"payment_intent_id"`
	ConcertID       int    `json:"concert_id"`
	TicketType      string `json:"ticket_type"`
	Quantity        int    `json:"quantity"`
}