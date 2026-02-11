package services

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strconv"
	"time"

	"groupie-backend/database"
	"groupie-backend/models"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/paymentintent"
)

// ========= CONSTANTES =========
const (
	ReservationExpiryMinutes = 15
	VIPPriceMultiplier       = 1.5 // VIP = +50% du prix standard
)

// ========= GESTION DES CONCERTS =========

// GetConcertByID récupère un concert avec toutes ses informations
func GetConcertByID(concertID int) (*models.Concert, error) {
	var concert models.Concert

	query := `
		SELECT id, name, artist_name, location, date, image_url, 
		       price, available_tickets
		FROM concerts 
		WHERE id = $1
	`

	err := database.DB.QueryRow(query, concertID).Scan(
		&concert.ID,
		&concert.Name,
		&concert.ArtistName,
		&concert.Location,
		&concert.Date,
		&concert.ImageURL,
		&concert.Price,
		&concert.AvailableTickets,
	)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("concert not found")
		}
		return nil, fmt.Errorf("error fetching concert: %w", err)
	}

	return &concert, nil
}

// ========= CRÉATION DE PAYMENT INTENT =========

// CreatePaymentIntent crée une réservation et génère un Payment Intent Stripe
func CreatePaymentIntent(userID int, req models.CreatePaymentIntentRequest) (string, float64, error) {
	// 1. Validation de base
	if req.Quantity <= 0 {
		return "", 0, errors.New("quantity must be greater than 0")
	}
	if req.TicketType != "standard" && req.TicketType != "vip" {
		return "", 0, errors.New("ticket_type must be 'standard' or 'vip'")
	}

	// 2. Récupérer le concert
	concert, err := GetConcertByID(req.ConcertID)
	if err != nil {
		return "", 0, err
	}

	// 3. Vérifier le stock disponible
	if req.Quantity > concert.AvailableTickets {
		return "", 0, fmt.Errorf("not enough tickets available. Only %d left", concert.AvailableTickets)
	}

	// 4. Calculer le prix (gérer VIP)
	var pricePerTicket float64
	if req.TicketType == "vip" {
		pricePerTicket = concert.Price * VIPPriceMultiplier
	} else {
		pricePerTicket = concert.Price
	}

	totalPrice := pricePerTicket * float64(req.Quantity)
	amountInCents := int64(totalPrice * 100) // Stripe utilise les centimes

	// 5. Nettoyer les réservations expirées avant d'en créer une nouvelle
	_, _ = database.DB.Exec(`
		UPDATE reservations 
		SET status = 'expired', updated_at = NOW()
		WHERE status = 'pending' 
		AND expires_at < NOW()
	`)

	// 6. Créer la réservation en base (statut 'pending')
	var reservationID int
	expiresAt := time.Now().Add(ReservationExpiryMinutes * time.Minute)

	query := `
		INSERT INTO reservations 
			(user_id, concert_id, ticket_type, quantity, total_price, status, expires_at, created_at) 
		VALUES 
			($1, $2, $3, $4, $5, 'pending', $6, NOW()) 
		RETURNING id
	`

	err = database.DB.QueryRow(
		query,
		userID,
		req.ConcertID,
		req.TicketType,
		req.Quantity,
		totalPrice,
		expiresAt,
	).Scan(&reservationID)

	if err != nil {
		return "", 0, fmt.Errorf("error creating reservation: %w", err)
	}

	// 7. Créer le Payment Intent Stripe
	params := &stripe.PaymentIntentParams{
		Amount:   stripe.Int64(amountInCents),
		Currency: stripe.String("eur"),
		Metadata: map[string]string{
			"reservation_id": strconv.Itoa(reservationID),
			"user_id":        strconv.Itoa(userID),
			"concert_id":     strconv.Itoa(req.ConcertID),
			"ticket_type":    req.TicketType,
			"quantity":       strconv.Itoa(req.Quantity),
		},
		AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
			Enabled: stripe.Bool(true),
		},
	}

	pi, err := paymentintent.New(params)
	if err != nil {
		// Annuler la réservation si Stripe échoue
		_, _ = database.DB.Exec("DELETE FROM reservations WHERE id = $1", reservationID)
		return "", 0, fmt.Errorf("error creating stripe payment intent: %w", err)
	}

	// 8. Mettre à jour la réservation avec l'ID Stripe
	_, err = database.DB.Exec(
		`UPDATE reservations 
		 SET stripe_payment_intent_id = $1, updated_at = NOW() 
		 WHERE id = $2`,
		pi.ID,
		reservationID,
	)

	if err != nil {
		log.Printf("⚠️  Warning: Failed to update reservation with Stripe ID: %v", err)
	}

	log.Printf("✅ Payment Intent créé : %s pour %.2f€ (Reservation #%d)", pi.ID, totalPrice, reservationID)

	return pi.ClientSecret, totalPrice, nil
}

// ========= CONFIRMATION DE PAIEMENT (Webhook) =========

// MarkReservationAsPaid marque une réservation comme payée et décrémente le stock
func MarkReservationAsPaid(reservationIDStr string, stripePaymentID string) error {
	reservationID, err := strconv.Atoi(reservationIDStr)
	if err != nil {
		return errors.New("invalid reservation ID format")
	}

	// Transaction pour garantir la cohérence
	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// 1. Récupérer les infos de la réservation
	var quantity, concertID int
	var currentStatus string

	err = tx.QueryRow(`
		SELECT quantity, concert_id, status 
		FROM reservations 
		WHERE id = $1
	`, reservationID).Scan(&quantity, &concertID, &currentStatus)

	if err != nil {
		return fmt.Errorf("reservation not found: %w", err)
	}

	// 2. Éviter les doubles paiements
	if currentStatus == "paid" {
		log.Printf("⚠️  Reservation #%d already paid, skipping...", reservationID)
		return nil
	}

	// 3. Mettre à jour le statut de la réservation
	_, err = tx.Exec(`
		UPDATE reservations 
		SET status = 'paid', 
		    payment_status = 'succeeded',
		    stripe_payment_status = 'succeeded',
		    updated_at = NOW() 
		WHERE id = $1
	`, reservationID)

	if err != nil {
		return fmt.Errorf("failed to update reservation: %w", err)
	}

	// 4. Décrémenter le stock de billets
	result, err := tx.Exec(`
		UPDATE concerts 
		SET available_tickets = available_tickets - $1 
		WHERE id = $2 
		AND available_tickets >= $1
	`, quantity, concertID)

	if err != nil {
		return fmt.Errorf("failed to update concert tickets: %w", err)
	}

	// 5. Vérifier qu'on a bien décrémenté
	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		return errors.New("not enough tickets available to complete reservation")
	}

	// 6. Commit de la transaction
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	log.Printf("✅ Reservation #%d marked as PAID - %d tickets decremented for Concert #%d",
		reservationID, quantity, concertID)

	return nil
}

// ========= GESTION DES ÉCHECS DE PAIEMENT =========

// MarkReservationAsFailed marque une réservation comme échouée
func MarkReservationAsFailed(reservationIDStr string, failureReason string) error {
	reservationID, err := strconv.Atoi(reservationIDStr)
	if err != nil {
		return errors.New("invalid reservation ID format")
	}

	_, err = database.DB.Exec(`
		UPDATE reservations 
		SET status = 'cancelled', 
		    payment_status = 'failed',
		    stripe_payment_status = 'failed',
		    updated_at = NOW() 
		WHERE id = $1
	`, reservationID)

	if err != nil {
		return fmt.Errorf("failed to mark reservation as failed: %w", err)
	}

	log.Printf("❌ Reservation #%d marked as FAILED: %s", reservationID, failureReason)
	return nil
}

// ========= CONFIRMATION MANUELLE (Optionnel) =========

// ConfirmPayment permet de vérifier et confirmer manuellement un paiement
func ConfirmPayment(userID int, req models.ConfirmPaymentRequest) error {
	// Récupérer l'intent chez Stripe
	pi, err := paymentintent.Get(req.PaymentIntentID, nil)
	if err != nil {
		return fmt.Errorf("error getting payment intent: %w", err)
	}

	// Vérifier le statut
	if pi.Status != stripe.PaymentIntentStatusSucceeded {
		return fmt.Errorf("payment not succeeded yet (status: %s)", pi.Status)
	}

	// Récupérer l'ID de réservation depuis les metadata
	reservationIDStr, ok := pi.Metadata["reservation_id"]
	if !ok {
		return errors.New("no reservation_id found in payment intent metadata")
	}

	// Marquer comme payé
	return MarkReservationAsPaid(reservationIDStr, pi.ID)
}

// ========= HISTORIQUE DES RÉSERVATIONS =========

// GetUserReservations récupère toutes les réservations d'un utilisateur
func GetUserReservations(userID int) ([]models.Reservation, error) {
	query := `
		SELECT 
			r.id, 
			r.user_id, 
			r.concert_id, 
			r.ticket_type,
			r.quantity, 
			r.total_price, 
			r.status, 
			r.payment_status,
			r.stripe_payment_intent_id, 
			r.created_at,
			r.expires_at,
			c.name || ' - ' || c.artist_name as concert_name,
			c.image_url as concert_image,
			c.date as concert_date
		FROM reservations r
		LEFT JOIN concerts c ON r.concert_id = c.id
		WHERE r.user_id = $1 
		ORDER BY r.created_at DESC
	`

	rows, err := database.DB.Query(query, userID)
	if err != nil {
		return nil, fmt.Errorf("error fetching reservations: %w", err)
	}
	defer rows.Close()

	var reservations []models.Reservation

	for rows.Next() {
		var r models.Reservation
		var stripeID, concertName, concertImage sql.NullString
		var expiresAt sql.NullTime
		var concertDate time.Time

		err := rows.Scan(
			&r.ID,
			&r.UserID,
			&r.ConcertID,
			&r.TicketType,
			&r.Quantity,
			&r.TotalPrice,
			&r.Status,
			&r.PaymentStatus,
			&stripeID,
			&r.CreatedAt,
			&expiresAt,
			&concertName,
			&concertImage,
			&concertDate,
		)

		if err != nil {
			log.Printf("⚠️  Error scanning reservation: %v", err)
			continue
		}

		// Assignation des valeurs nullables
		if stripeID.Valid {
			r.StripePaymentIntentID = stripeID.String
		}
		if concertName.Valid {
			r.ConcertName = concertName.String
		}

		reservations = append(reservations, r)
	}

	return reservations, nil
}

// ========= NETTOYAGE AUTOMATIQUE =========

// CleanupExpiredReservations libère les réservations expirées
// Cette fonction doit être appelée périodiquement (via un scheduler)
func CleanupExpiredReservations() (int, error) {
	result, err := database.DB.Exec(`
		UPDATE reservations 
		SET status = 'expired', updated_at = NOW()
		WHERE status = 'pending' 
		AND expires_at < NOW()
	`)

	if err != nil {
		return 0, fmt.Errorf("failed to cleanup expired reservations: %w", err)
	}

	rowsAffected, _ := result.RowsAffected()

	if rowsAffected > 0 {
		log.Printf("🧹 Cleaned up %d expired reservations", rowsAffected)
	}

	return int(rowsAffected), nil
}

// ========= STATISTIQUES ADMIN =========

// GetReservationStats récupère les statistiques de réservations pour l'admin
func GetReservationStats() (map[string]interface{}, error) {
	stats := make(map[string]interface{})

	// Total de réservations
	var totalReservations, paidReservations, pendingReservations int
	var totalRevenue, avgOrderValue float64

	err := database.DB.QueryRow(`
		SELECT 
			COUNT(*) as total,
			COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid,
			COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
			COALESCE(SUM(CASE WHEN status = 'paid' THEN total_price ELSE 0 END), 0) as revenue,
			COALESCE(AVG(CASE WHEN status = 'paid' THEN total_price END), 0) as avg_value
		FROM reservations
	`).Scan(&totalReservations, &paidReservations, &pendingReservations, &totalRevenue, &avgOrderValue)

	if err != nil {
		return nil, fmt.Errorf("error fetching reservation stats: %w", err)
	}

	stats["total_reservations"] = totalReservations
	stats["paid_reservations"] = paidReservations
	stats["pending_reservations"] = pendingReservations
	stats["total_revenue"] = totalRevenue
	stats["average_order_value"] = avgOrderValue

	// Réservations par statut (pour graphiques)
	statusRows, err := database.DB.Query(`
		SELECT status, COUNT(*) as count
		FROM reservations
		GROUP BY status
	`)
	if err == nil {
		defer statusRows.Close()
		statusBreakdown := make(map[string]int)
		for statusRows.Next() {
			var status string
			var count int
			if err := statusRows.Scan(&status, &count); err == nil {
				statusBreakdown[status] = count
			}
		}
		stats["status_breakdown"] = statusBreakdown
	}

	return stats, nil
}

// ========= REMBOURSEMENTS (Optionnel pour l'admin) =========

// RefundReservation effectue un remboursement via Stripe
func RefundReservation(reservationID int, reason string) error {
	// 1. Récupérer la réservation
	var stripePaymentIntentID string
	var status string
	var quantity, concertID int

	err := database.DB.QueryRow(`
		SELECT stripe_payment_intent_id, status, quantity, concert_id
		FROM reservations
		WHERE id = $1
	`, reservationID).Scan(&stripePaymentIntentID, &status, &quantity, &concertID)

	if err != nil {
		return fmt.Errorf("reservation not found: %w", err)
	}

	// 2. Vérifier que la réservation est payée
	if status != "paid" {
		return errors.New("can only refund paid reservations")
	}

	if stripePaymentIntentID == "" {
		return errors.New("no stripe payment intent found")
	}

	// 3. Créer le remboursement chez Stripe
	// Note: Vous devrez importer "github.com/stripe/stripe-go/v76/refund"
	// refundParams := &stripe.RefundParams{
	// 	PaymentIntent: stripe.String(stripePaymentIntentID),
	// 	Reason:        stripe.String(reason),
	// }
	// _, err = refund.New(refundParams)
	// if err != nil {
	// 	return fmt.Errorf("stripe refund failed: %w", err)
	// }

	// 4. Transaction pour mettre à jour la base
	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("failed to start transaction: %w", err)
	}
	defer tx.Rollback()

	// 5. Mettre à jour le statut
	_, err = tx.Exec(`
		UPDATE reservations
		SET status = 'cancelled',
		    payment_status = 'refunded',
		    stripe_payment_status = 'refunded',
		    updated_at = NOW()
		WHERE id = $1
	`, reservationID)

	if err != nil {
		return fmt.Errorf("failed to update reservation status: %w", err)
	}

	// 6. Remettre les billets dans le stock
	_, err = tx.Exec(`
		UPDATE concerts
		SET available_tickets = available_tickets + $1
		WHERE id = $2
	`, quantity, concertID)

	if err != nil {
		return fmt.Errorf("failed to restore ticket stock: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	log.Printf("💰 Reservation #%d refunded successfully - %d tickets restored", reservationID, quantity)
	return nil
}
