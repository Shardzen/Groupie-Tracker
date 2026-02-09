package handlers

import (
	"encoding/json"
    "log"
    "net/http"
    "time"
    "groupie-backend/database"
    "groupie-backend/models"
    "groupie-backend/services"
	"groupie-backend/middleware"
    
)


func Register(w http.ResponseWriter, r *http.Request) {
	log.Println("📩 Requête d'inscription reçue !") 
    var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Invalid request body",
		})
		return
	}

	user, err := services.RegisterUser(req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": err.Error(),
		})
		return
	}

	token, err := services.GenerateToken(*user)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Error generating token",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(models.LoginResponse{
		Token: token,
		User:  *user,
	})
}


func Login(w http.ResponseWriter, r *http.Request) {
    var req models.LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
        return
    }

    user, token, err := services.LoginUser(req)
    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(models.LoginResponse{
        Token: token,
        User:  *user,
    })
} 


func VerifyEmail(w http.ResponseWriter, r *http.Request) {
    token := r.URL.Query().Get("token")
    if token == "" {
        http.Error(w, "Token manquant", http.StatusBadRequest)
        return
    }

    var userID int
    var expiresAt time.Time

    query := `SELECT user_id, expires_at FROM email_verification_tokens WHERE token = $1`
    err := database.DB.QueryRow(query, token).Scan(&userID, &expiresAt)

    if err != nil {
        log.Printf("❌ Token invalide : %v", err)
        http.Redirect(w, r, "http://localhost:5173/verify-error", http.StatusSeeOther)
        return
    }

    if time.Now().After(expiresAt) {
        log.Println("⚠️ Token expiré")
        http.Redirect(w, r, "http://localhost:5173/verify-error?reason=expired", http.StatusSeeOther)
        return
    }

    tx, err := database.DB.Begin()
    if err != nil {
        http.Error(w, "Erreur interne", http.StatusInternalServerError)
        return
    }

    _, err = tx.Exec("UPDATE users SET email_verified = true WHERE id = $1", userID)
    if err != nil {
        tx.Rollback()
        http.Error(w, "Erreur lors de la validation", http.StatusInternalServerError)
        return
    }

    _, err = tx.Exec("DELETE FROM email_verification_tokens WHERE token = $1", token)
    if err != nil {
        tx.Rollback()
        http.Error(w, "Erreur nettoyage token", http.StatusInternalServerError)
        return
    }

    tx.Commit()

    log.Printf("✅ Utilisateur %d vérifié avec succès !", userID)
    http.Redirect(w, r, "http://localhost:5173/verify-success", http.StatusSeeOther)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
    
    claims, ok := middleware.GetUserFromContext(r)
    if !ok {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
        return
    }

    
    user, err := services.GetUserByID(claims.UserID)
    if err != nil {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusNotFound)
        json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
        return
    }

    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(user)
}