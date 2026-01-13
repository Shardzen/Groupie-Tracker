package services

import (
	"database/sql"
	"errors"
	"fmt"
	"os"

	"groupie-backend/database"
	"groupie-backend/models"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
)

func init() {
	stripe.Key = os.Getenv("STRIPE_SECRET_KEY")
}

func GetConcertByID(concertID int) (*models.Concert, error) {
	var concert models.Concert
	err := database.DB.QueryRow(
		`SELECT id, name, artist_name, venue, city, date, image_url, standard_price, vip_price, available_standard, available_vip, created_at 
		FROM concerts WHERE id = $1`,
		concertID,
	).Scan(
		&concert.ID, &concert.Name, &concert.ArtistName, &concert.Venue, &concert.City,
		&concert.Date, &concert.ImageURL, &concert.StandardPrice, &concert.VIPPrice,
		&concert.AvailableStandard, &concert.AvailableVIP, &concert.CreatedAt,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("concert not found")
		}
		return nil, fmt.Errorf("error fetching concert: %w", err)
	}

	return &concert, nil
}

func CreatePaymentIntent(userID int, req models.CreatePaymentIntentRequest) (string, float64, error) {
	if req.Quantity <= 0 {
		return "", 0, errors.New("quantity must be greater than 0")
	}

	concert, err := GetConcertByID(req.ConcertID)
	if err != nil {
		return "", 0, err
	}

	var price float64
	var availableTickets int

	switch req.TicketType {
	case "standard":
		price = concert.StandardPrice
		availableTickets = concert.AvailableStandard
	case "vip":
		price = concert.VIPPrice
		availableTickets = concert.AvailableVIP
	default:
		return "", 0, errors.New("invalid ticket type. Must be 'standard' or 'vip'")
	}

	if req.Quantity > availableTickets {
		return "", 0, fmt.Errorf("not enough tickets available. Only %d left", availableTickets)
	}

	totalPrice := price * float64(req.Quantity)
	amountInCents := int64(totalPrice * 100)

	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amountInCents),
		Currency: stripe.String("eur"),
		Metadata: map[string]string{
			"user_id":     fmt.Sprintf("%d", userID),
			"concert_id":  fmt.Sprintf("%d", req.ConcertID),
			"ticket_type": req.TicketType,
			"quantity":    fmt.Sprintf("%d", req.Quantity),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		return "", 0, fmt.Errorf("error creating payment intent: %w", err)
	}

	_, err = database.DB.Exec(
		`INSERT INTO reservations (user_id, concert_id, ticket_type, quantity, total_price, status, stripe_payment_intent_id) 
		VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		userID, req.ConcertID, req.TicketType, req.Quantity, totalPrice, "pending", pi.ID,
	)
	if err != nil {
		return "", 0, fmt.Errorf("error creating reservation: %w", err)
	}

	return pi.ClientSecret, totalPrice, nil
}

func ConfirmPayment(userID int, req models.ConfirmPaymentRequest) error {
	var reservationID int
	var currentStatus string

	err := database.DB.QueryRow(
		`SELECT id, status FROM reservations 
		WHERE stripe_payment_intent_id = $1 AND user_id = $2`,
		req.PaymentIntentID, userID,
	).Scan(&reservationID, &currentStatus)

	if err != nil {
		if err == sql.ErrNoRows {
			return errors.New("reservation not found")
		}
		return fmt.Errorf("error finding reservation: %w", err)
	}

	if currentStatus == "confirmed" {
		return errors.New("payment already confirmed")
	}

	pi, err := paymentintent.Get(req.PaymentIntentID, nil)
	if err != nil {
		return fmt.Errorf("error retrieving payment intent from Stripe: %w", err)
	}

	if pi.Status != stripe.PaymentIntentStatusSucceeded {
		return fmt.Errorf("payment not successful. Status: %s", pi.Status)
	}

	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("error starting transaction: %w", err)
	}
	defer tx.Rollback()

	_, err = tx.Exec(
		`UPDATE reservations 
		SET status = $1, stripe_payment_status = $2, updated_at = CURRENT_TIMESTAMP 
		WHERE id = $3`,
		"confirmed", string(pi.Status), reservationID,
	)
	if err != nil {
		return fmt.Errorf("error updating reservation: %w", err)
	}

	var updateQuery string
	if req.TicketType == "standard" {
		updateQuery = `UPDATE concerts SET available_standard = available_standard - $1 WHERE id = $2`
	} else {
		updateQuery = `UPDATE concerts SET available_vip = available_vip - $1 WHERE id = $2`
	}

	_, err = tx.Exec(updateQuery, req.Quantity, req.ConcertID)
	if err != nil {
		return fmt.Errorf("error updating concert availability: %w", err)
	}

	if err = tx.Commit(); err != nil {
		return fmt.Errorf("error committing transaction: %w", err)
	}

	return nil
}

func GetUserReservations(userID int) ([]models.Reservation, error) {
	rows, err := database.DB.Query(
		`SELECT id, user_id, concert_id, ticket_type, quantity, total_price, status, 
		stripe_payment_intent_id, stripe_payment_status, created_at, updated_at 
		FROM reservations WHERE user_id = $1 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, fmt.Errorf("error fetching reservations: %w", err)
	}
	defer rows.Close()

	var reservations []models.Reservation
	for rows.Next() {
		var r models.Reservation
		var paymentIntentID, paymentStatus sql.NullString

		err := rows.Scan(
			&r.ID, &r.UserID, &r.ConcertID, &r.TicketType, &r.Quantity,
			&r.TotalPrice, &r.Status, &paymentIntentID, &paymentStatus,
			&r.CreatedAt, &r.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning reservation: %w", err)
		}

		if paymentIntentID.Valid {
			r.StripePaymentIntentID = paymentIntentID.String
		}
		if paymentStatus.Valid {
			r.StripePaymentStatus = paymentStatus.String
		}

		reservations = append(reservations, r)
	}

	return reservations, nil
}
