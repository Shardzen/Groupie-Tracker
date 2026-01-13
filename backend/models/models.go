package models

import "time"

type Artist struct {
	ID           int      `json:"id"`
	Name         string   `json:"name"`
	Image        string   `json:"image"`
	Bio          string   `json:"bio"`
	Members      []string `json:"members"`
	CreationDate int      `json:"creationDate"`
	FirstAlbum   string   `json:"firstAlbum"`
	Locations    []string `json:"locations"`
	ConcertDates []string `json:"concertDates"`
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
	Name              string    `json:"name"`
	ArtistName        string    `json:"artist_name"`
	ArtistID          int       `json:"artist_id"`
	Venue             string    `json:"venue"`
	City              string    `json:"city"`
	Date              time.Time `json:"date"`
	ImageURL          string    `json:"image_url"`
	StandardPrice     float64   `json:"standard_price"`
	VIPPrice          float64   `json:"vip_price"`
	AvailableStandard int       `json:"available_standard"`
	AvailableVIP      int       `json:"available_vip"`
	CreatedAt         time.Time `json:"created_at"`
}

type Reservation struct {
	ID                    int       `json:"id"`
	UserID                int       `json:"user_id"`
	ConcertID             int       `json:"concert_id"`
	TicketType            string    `json:"ticket_type"`
	Quantity              int       `json:"quantity"`
	TotalPrice            float64   `json:"total_price"`
	Status                string    `json:"status"`
	StripePaymentIntentID string    `json:"stripe_payment_intent_id,omitempty"`
	StripePaymentStatus   string    `json:"stripe_payment_status,omitempty"`
	CreatedAt             time.Time `json:"created_at"`
	UpdatedAt             time.Time `json:"updated_at"`
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
