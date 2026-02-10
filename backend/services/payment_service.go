package services

import (
	"database/sql"
	"errors"
	"fmt"
	"strconv"

	"groupie-backend/database"
	"groupie-backend/models"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
)

// Pas de fonction init() ici car stripe.Key est défini dans main.go via os.Getenv

// GetConcertByID : Récupère les infos du concert pour vérifier le prix et le stock
func GetConcertByID(concertID int) (*models.Concert, error) {
	var concert models.Concert
	// Note: Assure-toi que les noms de colonnes correspondent à ta BDD
	err := database.DB.QueryRow(
		`SELECT id, name, artist_name, location, date, image_url, price, available_tickets 
		 FROM concerts WHERE id = $1`,
		concertID,
	).Scan(
		&concert.ID, &concert.Name, &concert.ArtistName, &concert.Location,
		&concert.Date, &concert.ImageURL, &concert.Price, &concert.AvailableTickets,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("concert not found")
		}
		return nil, fmt.Errorf("error fetching concert: %w", err)
	}

	return &concert, nil
}

// CreatePaymentIntent : Crée la réservation en BDD PUIS l'intent Stripe
func CreatePaymentIntent(userID int, req models.CreatePaymentIntentRequest) (string, float64, error) {
	if req.Quantity <= 0 {
		return "", 0, errors.New("quantity must be greater than 0")
	}

	// 1. Vérifier le concert et le stock
	concert, err := GetConcertByID(req.ConcertID)
	if err != nil {
		return "", 0, err
	}

	if req.Quantity > concert.AvailableTickets {
		return "", 0, fmt.Errorf("not enough tickets available. Only %d left", concert.AvailableTickets)
	}

	// 2. Calculer le prix
	totalPrice := concert.Price * float64(req.Quantity)
	amountInCents := int64(totalPrice * 100)

	// 3. Créer la réservation en base de données D'ABORD (Statut Pending)
	// On le fait avant Stripe pour pouvoir envoyer l'ID de réservation à Stripe (Metadata)
	var reservationID int
	query := `
		INSERT INTO reservations (user_id, concert_id, quantity, total_price, status, created_at) 
		VALUES ($1, $2, $3, $4, 'pending', NOW()) 
		RETURNING id`
	
	err = database.DB.QueryRow(query, userID, req.ConcertID, req.Quantity, totalPrice).Scan(&reservationID)
	if err != nil {
		return "", 0, fmt.Errorf("error creating database reservation: %w", err)
	}

	// 4. Créer l'Intent Stripe avec les Metadata
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amountInCents),
		Currency: stripe.String("eur"),
		Metadata: map[string]string{
			"reservation_id": strconv.Itoa(reservationID), // CRUCIAL pour le webhook
			"user_id":        strconv.Itoa(userID),
			"concert_id":     strconv.Itoa(req.ConcertID),
			"quantity":       strconv.Itoa(req.Quantity),
		},
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		// Si Stripe échoue, on devrait annuler la réservation en BDD pour rester propre
		// database.DB.Exec("DELETE FROM reservations WHERE id = $1", reservationID)
		return "", 0, fmt.Errorf("error creating stripe payment intent: %w", err)
	}

	// 5. Mettre à jour la réservation avec l'ID Stripe
	_, err = database.DB.Exec(
		`UPDATE reservations SET stripe_payment_intent_id = $1 WHERE id = $2`,
		pi.ID, reservationID,
	)
	if err != nil {
		return "", 0, fmt.Errorf("error updating reservation with stripe id: %w", err)
	}

	return pi.ClientSecret, totalPrice, nil
}

// MarkReservationAsPaid : Appelée par le Webhook quand le paiement est validé
func MarkReservationAsPaid(reservationIDStr string, stripePaymentID string) error {
	reservationID, err := strconv.Atoi(reservationIDStr)
	if err != nil {
		return errors.New("invalid reservation ID format")
	}

	// On utilise une transaction pour assurer que tout se passe bien (Update status + Décrément stock)
	tx, err := database.DB.Begin()
	if err != nil {
		return err
	}
	defer tx.Rollback()

	// 1. Récupérer la quantité commandée et le concert ID
	var quantity, concertID int
	err = tx.QueryRow("SELECT quantity, concert_id FROM reservations WHERE id = $1", reservationID).Scan(&quantity, &concertID)
	if err != nil {
		return fmt.Errorf("reservation not found: %w", err)
	}

	// 2. Mettre à jour le statut de la réservation
	_, err = tx.Exec(
		`UPDATE reservations 
		 SET status = 'paid', stripe_payment_status = 'succeeded', updated_at = NOW() 
		 WHERE id = $1`,
		reservationID,
	)
	if err != nil {
		return fmt.Errorf("failed to update reservation status: %w", err)
	}

	// 3. Décrémenter le stock de billets
	_, err = tx.Exec(
		`UPDATE concerts SET available_tickets = available_tickets - $1 WHERE id = $2`,
		quantity, concertID,
	)
	if err != nil {
		return fmt.Errorf("failed to update concert tickets: %w", err)
	}

	return tx.Commit()
}

// ConfirmPayment : Validation manuelle (Optionnel si tu utilises le Webhook)
func ConfirmPayment(userID int, req models.ConfirmPaymentRequest) error {
	// Cette fonction vérifie juste l'état chez Stripe et met à jour si nécessaire
	// Utile si le webhook a échoué ou si tu veux valider immédiatement côté client
	
	pi, err := paymentintent.Get(req.PaymentIntentID, nil)
	if err != nil {
		return fmt.Errorf("error getting intent: %w", err)
	}

	if pi.Status == stripe.PaymentIntentStatusSucceeded {
		// On récupère l'ID de réservation depuis les metadata
		if resID, ok := pi.Metadata["reservation_id"]; ok {
			return MarkReservationAsPaid(resID, pi.ID)
		}
	}
	
	return errors.New("payment not succeeded yet")
}

// GetUserReservations : Historique des réservations
func GetUserReservations(userID int) ([]models.Reservation, error) {
	rows, err := database.DB.Query(
		`SELECT id, user_id, concert_id, quantity, total_price, status, 
		 stripe_payment_intent_id, created_at
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
		var stripeID sql.NullString 

		err := rows.Scan(
			&r.ID, &r.UserID, &r.ConcertID, &r.Quantity,
			&r.TotalPrice, &r.Status, &stripeID, &r.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("error scanning reservation: %w", err)
		}

		if stripeID.Valid {
			r.StripePaymentIntentID = stripeID.String
		}


		concert, _ := GetConcertByID(r.ConcertID)
		if concert != nil {
			r.ConcertName = concert.ArtistName + " - " + concert.Location
		}

		reservations = append(reservations, r)
	}

	return reservations, nil
}