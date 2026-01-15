package handlers

import (
	"encoding/json"
	"net/http"

	"groupie-backend/database"
)

func HealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	dbStatus := "connected"
	if err := database.DB.Ping(); err != nil {
		dbStatus = "disconnected"
		w.WriteHeader(http.StatusServiceUnavailable)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":   "unhealthy",
			"service":  "groupie-tracker-api",
			"version":  "1.0.0",
			"database": dbStatus,
			"error":    err.Error(),
		})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":   "healthy",
		"service":  "groupie-tracker-api",
		"version":  "1.0.0",
		"database": dbStatus,
	})
}
