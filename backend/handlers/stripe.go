package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"groupie-backend/middleware"
	"groupie-backend/models"
	"groupie-backend/services"

	"github.com/stripe/stripe-go/v76"
	"github.com/stripe/stripe-go/v76/webhook"
)

// ========= CRÉATION DE PAYMENT INTENT =========

// CreatePaymentIntent crée un Payment Intent Stripe pour réserver des billets
func CreatePaymentIntent(w http.ResponseWriter, r *http.Request) {
	// 1. Récupérer l'utilisateur authentifié
	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Unauthorized - JWT token required",
		})
		return
	}

	// 2. Parser la requête
	var req models.CreatePaymentIntentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid request body",
		})
		return
	}

	// 3. Validation de base
	if req.ConcertID <= 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid concert_id",
		})
		return
	}

	if req.Quantity <= 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Quantity must be greater than 0",
		})
		return
	}

	if req.TicketType != "standard" && req.TicketType != "vip" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "ticket_type must be 'standard' or 'vip'",
		})
		return
	}

	// 4. Créer le Payment Intent via le service
	clientSecret, amount, err := services.CreatePaymentIntent(int(claims.UserID), req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	// 5. Retourner le client_secret pour le frontend
	log.Printf("✅ Payment Intent created for user %d: Amount=%.2f€", claims.UserID, amount)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.CreatePaymentIntentResponse{
		ClientSecret: clientSecret,
		Amount:       amount,
	})
}

// ========= CONFIRMATION MANUELLE (Optionnel) =========

// ConfirmPayment permet une confirmation manuelle du paiement côté client
// Note: Le Webhook est la méthode recommandée, mais ceci peut servir de backup
func ConfirmPayment(w http.ResponseWriter, r *http.Request) {
	// 1. Authentification
	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Unauthorized",
		})
		return
	}

	// 2. Parser la requête
	var req models.ConfirmPaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid request body",
		})
		return
	}

	// 3. Validation
	if req.PaymentIntentID == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "payment_intent_id is required",
		})
		return
	}

	// 4. Confirmer via le service
	if err := services.ConfirmPayment(int(claims.UserID), req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	log.Printf("✅ Payment confirmed manually for user %d", claims.UserID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Payment confirmed successfully",
	})
}

// ========= RÉCUPÉRATION DES RÉSERVATIONS =========

// GetReservations récupère l'historique des réservations d'un utilisateur
func GetReservations(w http.ResponseWriter, r *http.Request) {
	// 1. Authentification
	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Unauthorized",
		})
		return
	}

	// 2. Récupérer les réservations
	reservations, err := services.GetUserReservations(int(claims.UserID))
	if err != nil {
		log.Printf("❌ Error fetching reservations for user %d: %v", claims.UserID, err)
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Error fetching reservations",
		})
		return
	}

	// 3. Retourner les réservations
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(reservations)
}

func StripeWebhook(w http.ResponseWriter, r *http.Request) {
	const MaxBodyBytes = int64(65536) // 64KB max

	r.Body = http.MaxBytesReader(w, r.Body, MaxBodyBytes)
	payload, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("❌ Webhook: Error reading body: %v", err)
		w.WriteHeader(http.StatusServiceUnavailable)
		return
	}

	endpointSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")
	if endpointSecret == "" {
		log.Println("❌ WEBHOOK ERROR: STRIPE_WEBHOOK_SECRET not configured in .env")
		w.WriteHeader(http.StatusInternalServerError)
		fmt.Fprintf(w, "Webhook secret not configured")
		return
	}

	signature := r.Header.Get("Stripe-Signature")
	event, err := webhook.ConstructEvent(payload, signature, endpointSecret)
	if err != nil {
		log.Printf("❌ Webhook signature verification failed: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Webhook signature verification failed: %v", err)
		return
	}

	log.Printf("🪝 Webhook received: %s", event.Type)

	switch event.Type {
	case "payment_intent.succeeded":
		handlePaymentSucceeded(w, event)

	case "payment_intent.payment_failed":
		handlePaymentFailed(w, event)

	case "payment_intent.canceled":
		handlePaymentCanceled(w, event)

	default:
		// Événements non traités (mais on retourne 200 quand même)
		log.Printf("ℹ️  Webhook event ignored: %s", event.Type)
	}

	// 5. Toujours retourner 200 pour éviter les retry de Stripe
	w.WriteHeader(http.StatusOK)
}

// ========= HELPERS WEBHOOK =========

// handlePaymentSucceeded traite un paiement réussi
func handlePaymentSucceeded(w http.ResponseWriter, event stripe.Event) {
	var paymentIntent stripe.PaymentIntent
	err := json.Unmarshal(event.Data.Raw, &paymentIntent)
	if err != nil {
		log.Printf("❌ Error parsing payment_intent.succeeded: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error parsing webhook JSON: %v", err)
		return
	}

	// Récupérer l'ID de réservation depuis les metadata
	reservationID, ok := paymentIntent.Metadata["reservation_id"]
	if !ok {
		log.Printf("⚠️  Payment succeeded but no reservation_id in metadata: %s", paymentIntent.ID)
		return
	}

	// Marquer la réservation comme payée
	err = services.MarkReservationAsPaid(reservationID, paymentIntent.ID)
	if err != nil {
		log.Printf("❌ Failed to mark reservation as paid (ID: %s): %v", reservationID, err)
		// On ne retourne pas d'erreur HTTP car le paiement Stripe a réussi
		// L'admin devra gérer manuellement
		return
	}

	log.Printf("✅ PAYMENT SUCCEEDED - Reservation #%s marked as PAID (Payment Intent: %s)",
		reservationID, paymentIntent.ID)
}

// handlePaymentFailed traite un échec de paiement
// handlePaymentFailed traite un échec de paiement
func handlePaymentFailed(w http.ResponseWriter, event stripe.Event) {
	var paymentIntent stripe.PaymentIntent
	err := json.Unmarshal(event.Data.Raw, &paymentIntent)
	if err != nil {
		log.Printf("❌ Error parsing payment_intent.payment_failed: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error parsing webhook JSON: %v", err)
		return
	}

	reservationID, ok := paymentIntent.Metadata["reservation_id"]
	if !ok {
		log.Printf("⚠️  Payment failed but no reservation_id in metadata: %s", paymentIntent.ID)
		return
	}

	failureReason := "Payment failed"

	// --- CHANGE STARTS HERE ---
	if paymentIntent.LastPaymentError != nil {
		// Use .Error() instead of .Message to ensure compatibility
		failureReason = paymentIntent.LastPaymentError.Error()
	}
	// --- CHANGE ENDS HERE ---

	err = services.MarkReservationAsFailed(reservationID, failureReason)
	if err != nil {
		log.Printf("❌ Failed to mark reservation as failed (ID: %s): %v", reservationID, err)
		return
	}

	log.Printf("❌ PAYMENT FAILED - Reservation #%s marked as FAILED: %s", reservationID, failureReason)
}

// handlePaymentCanceled traite une annulation de paiement
func handlePaymentCanceled(w http.ResponseWriter, event stripe.Event) {
	var paymentIntent stripe.PaymentIntent
	err := json.Unmarshal(event.Data.Raw, &paymentIntent)
	if err != nil {
		log.Printf("❌ Error parsing payment_intent.canceled: %v", err)
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprintf(w, "Error parsing webhook JSON: %v", err)
		return
	}

	reservationID, ok := paymentIntent.Metadata["reservation_id"]
	if !ok {
		log.Printf("⚠️  Payment canceled but no reservation_id in metadata: %s", paymentIntent.ID)
		return
	}

	err = services.MarkReservationAsFailed(reservationID, "Payment canceled by user")
	if err != nil {
		log.Printf("❌ Failed to mark reservation as canceled (ID: %s): %v", reservationID, err)
		return
	}

	log.Printf("🚫 PAYMENT CANCELED - Reservation #%s marked as CANCELED", reservationID)
}

// ========= LEGACY / DEPRECATED =========

// CreateBooking (Deprecated - utilisez /payment/create-intent à la place)
func CreateBooking(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusGone)
	json.NewEncoder(w).Encode(map[string]string{
		"error": "This endpoint is deprecated. Use POST /api/payment/create-intent instead",
	})
}
