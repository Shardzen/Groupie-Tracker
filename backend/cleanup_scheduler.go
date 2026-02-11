package main

import (
	"log"
	"time"

	"groupie-backend/database"
	"groupie-backend/services"
)

// CleanupScheduler lance le nettoyage périodique des réservations expirées
func StartCleanupScheduler() {
	// Lancer le nettoyage toutes les 5 minutes
	ticker := time.NewTicker(5 * time.Minute)
	
	go func() {
		// Premier nettoyage immédiat au démarrage
		cleanupReservations()
		
		// Puis périodique
		for range ticker.C {
			cleanupReservations()
		}
	}()
	
	log.Println("🧹 Cleanup scheduler started (runs every 5 minutes)")
}

func cleanupReservations() {
	count, err := services.CleanupExpiredReservations()
	if err != nil {
		log.Printf("❌ Error cleaning up reservations: %v", err)
		return
	}
	
	if count > 0 {
		log.Printf("🧹 Cleaned up %d expired reservation(s)", count)
	}
}

// ReservationStatsLogger affiche les stats périodiquement
func StartStatsLogger() {
	ticker := time.NewTicker(1 * time.Hour)
	
	go func() {
		for range ticker.C {
			logStats()
		}
	}()
	
	log.Println("📊 Stats logger started (runs every hour)")
}

func logStats() {
	var totalReservations int
	var paidReservations int
	var revenue float64
	
	err := database.DB.QueryRow(`
		SELECT 
			COUNT(*) as total,
			COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid,
			COALESCE(SUM(CASE WHEN status = 'paid' THEN total_price ELSE 0 END), 0) as revenue
		FROM reservations
		WHERE created_at >= NOW() - INTERVAL '24 hours'
	`).Scan(&totalReservations, &paidReservations, &revenue)
	
	if err != nil {
		log.Printf("❌ Error fetching stats: %v", err)
		return
	}
	
	log.Printf("📊 Last 24h Stats: %d reservations (%d paid) - Revenue: %.2f€", 
		totalReservations, paidReservations, revenue)
}
