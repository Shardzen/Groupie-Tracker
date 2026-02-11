package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"groupie-backend/database"
	"groupie-backend/middleware"
)

type DashboardStats struct {
	TotalArtists     int             `json:"total_artists"`
	TotalConcerts    int             `json:"total_concerts"`
	TotalUsers       int             `json:"total_users"`
	TotalRevenue     float64         `json:"total_revenue"`
	RecentBookings   int             `json:"recent_bookings"`
	PopularArtists   []PopularArtist `json:"popular_artists"`
	RevenueByMonth   []RevenueData   `json:"revenue_by_month"`
	BookingsByStatus map[string]int  `json:"bookings_by_status"`
	UpcomingConcerts int             `json:"upcoming_concerts"`
}

type PopularArtist struct {
	ArtistName    string  `json:"artist_name"`
	ArtistImage   string  `json:"artist_image"`
	TotalBookings int     `json:"total_bookings"`
	TotalRevenue  float64 `json:"total_revenue"`
}

type RevenueData struct {
	Month   string  `json:"month"`
	Revenue float64 `json:"revenue"`
}

type ActivityLog struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	UserName  string    `json:"user_name"`
	Action    string    `json:"action"`
	Details   string    `json:"details"`
	IPAddress string    `json:"ip_address"`
	CreatedAt time.Time `json:"created_at"`
}

// AdminGetDashboard - Retourne les statistiques complètes du dashboard
func AdminGetDashboard(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || claims.Role != "admin" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	stats := DashboardStats{}

	// Total Artists
	database.DB.QueryRow("SELECT COUNT(*) FROM artists").Scan(&stats.TotalArtists)

	// Total Concerts
	database.DB.QueryRow("SELECT COUNT(*) FROM concerts").Scan(&stats.TotalConcerts)

	// Total Users
	database.DB.QueryRow("SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)

	// Total Revenue
	database.DB.QueryRow("SELECT COALESCE(SUM(total_price), 0) FROM reservations WHERE payment_status = 'succeeded'").Scan(&stats.TotalRevenue)

	// Recent Bookings (last 7 days)
	database.DB.QueryRow(`
		SELECT COUNT(*) FROM reservations 
		WHERE created_at >= NOW() - INTERVAL '7 days'
	`).Scan(&stats.RecentBookings)

	// Upcoming Concerts
	database.DB.QueryRow(`
		SELECT COUNT(*) FROM concerts 
		WHERE date >= NOW()
	`).Scan(&stats.UpcomingConcerts)

	// Popular Artists (Top 5 by bookings)
	rows, err := database.DB.Query(`
		SELECT a.name, a.image, COUNT(r.id) as bookings, COALESCE(SUM(r.total_price), 0) as revenue
		FROM artists a
		LEFT JOIN concerts c ON a.id = c.artist_id
		LEFT JOIN reservations r ON c.id = r.concert_id AND r.payment_status = 'succeeded'
		GROUP BY a.id, a.name, a.image
		ORDER BY bookings DESC
		LIMIT 5
	`)
	if err == nil {
		defer rows.Close()
		for rows.Next() {
			var artist PopularArtist
			rows.Scan(&artist.ArtistName, &artist.ArtistImage, &artist.TotalBookings, &artist.TotalRevenue)
			stats.PopularArtists = append(stats.PopularArtists, artist)
		}
	}

	// Revenue by Month (last 6 months)
	revenueRows, err := database.DB.Query(`
		SELECT 
			TO_CHAR(created_at, 'Mon YYYY') as month,
			COALESCE(SUM(total_price), 0) as revenue
		FROM reservations
		WHERE payment_status = 'succeeded'
		AND created_at >= NOW() - INTERVAL '6 months'
		GROUP BY TO_CHAR(created_at, 'YYYY-MM'), TO_CHAR(created_at, 'Mon YYYY')
		ORDER BY TO_CHAR(created_at, 'YYYY-MM')
	`)
	if err == nil {
		defer revenueRows.Close()
		for revenueRows.Next() {
			var data RevenueData
			revenueRows.Scan(&data.Month, &data.Revenue)
			stats.RevenueByMonth = append(stats.RevenueByMonth, data)
		}
	}

	// Bookings by Status
	stats.BookingsByStatus = make(map[string]int)
	statusRows, err := database.DB.Query(`
		SELECT payment_status, COUNT(*) as count
		FROM reservations
		GROUP BY payment_status
	`)
	if err == nil {
		defer statusRows.Close()
		for statusRows.Next() {
			var status string
			var count int
			statusRows.Scan(&status, &count)
			stats.BookingsByStatus[status] = count
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}

// AdminGetActivityLogs - Retourne les logs d'activité
func AdminGetActivityLogs(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok || claims.Role != "admin" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
		return
	}

	limit := r.URL.Query().Get("limit")
	if limit == "" {
		limit = "50"
	}

	rows, err := database.DB.Query(`
		SELECT l.id, l.user_id, u.name, l.action, l.details, l.ip_address, l.created_at
		FROM activity_logs l
		LEFT JOIN users u ON l.user_id = u.id
		ORDER BY l.created_at DESC
		LIMIT $1
	`, limit)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Database error"})
		return
	}
	defer rows.Close()

	logs := []ActivityLog{}
	for rows.Next() {
		var log ActivityLog
		rows.Scan(&log.ID, &log.UserID, &log.UserName, &log.Action, &log.Details, &log.IPAddress, &log.CreatedAt)
		logs = append(logs, log)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(logs)
}

// LogActivity - Fonction utilitaire pour logger une activité
func LogActivity(userID int, action, details, ipAddress string) error {
	_, err := database.DB.Exec(`
		INSERT INTO activity_logs (user_id, action, details, ip_address, created_at)
		VALUES ($1, $2, $3, $4, NOW())
	`, userID, action, details, ipAddress)
	return err
}
