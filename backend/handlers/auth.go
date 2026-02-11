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
    "fmt"
)

func Register(w http.ResponseWriter, r *http.Request) {
	log.Println("📩 Requête d'inscription reçue !")
	var req models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request body"})
		return
	}

	user, token, err := services.RegisterUser(req) // Updated to get token
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	token, err := services.GenerateToken(*user)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error generating token"})
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

func ForgotPassword(w http.ResponseWriter, r *http.Request) {
    var req struct {
        Email string `json:"email"`
    }
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Requête invalide", http.StatusBadRequest)
        return
    }

    var userID int
    err := database.DB.QueryRow("SELECT id FROM users WHERE email = $1", req.Email).Scan(&userID)
    if err != nil {
        w.WriteHeader(http.StatusOK)
        return
    }

    database.DB.Exec("DELETE FROM password_reset_tokens WHERE user_id = $1", userID)

    token := fmt.Sprintf("%x", time.Now().UnixNano())
    _, err = database.DB.Exec("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
        userID, token, time.Now().Add(time.Hour))

    if err != nil {
        log.Printf("Erreur insertion token: %v", err)
        http.Error(w, "Erreur serveur", http.StatusInternalServerError)
        return
    }

    services.SendPasswordResetEmail(req.Email, token)
    w.WriteHeader(http.StatusOK)
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    
    var req struct {
        Token       string `json:"token"`
        NewPassword string `json:"new_password"`
    }
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        log.Printf("❌ Erreur décodage JSON: %v", err)
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"error": "Données invalides"})
        return
    }

    log.Printf("🔍 Tentative de reset avec le token: %s", req.Token)

    var userID int
    err := database.DB.QueryRow(
        "SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > $2",
        req.Token, time.Now(),
    ).Scan(&userID)

    if err != nil {
        log.Printf("❌ Token invalide ou expiré dans la DB: %v", err)
        w.WriteHeader(http.StatusUnauthorized)
        json.NewEncoder(w).Encode(map[string]string{"error": "Lien invalide ou expiré"})
        return
    }

    hashedPassword, _ := services.HashPassword(req.NewPassword)

    tx, _ := database.DB.Begin()
    
    _, err = tx.Exec("UPDATE users SET password_hash = $1 WHERE id = $2", hashedPassword, userID)
    if err != nil {
        tx.Rollback()
        log.Printf("❌ Erreur SQL lors de l'UPDATE: %v", err)
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"error": "Erreur lors de la mise à jour"})
        return
    }

    tx.Exec("DELETE FROM password_reset_tokens WHERE token = $1", req.Token)
    tx.Commit()

    log.Println("✅ Mot de passe mis à jour avec succès pour l'ID:", userID)
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(map[string]string{"message": "Mot de passe mis à jour !"})
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
		http.Redirect(w, r, "http://localhost:5173/verify-error?reason=expired", http.StatusSeeOther)
		return
	}

	tx, _ := database.DB.Begin()
	tx.Exec("UPDATE users SET email_verified = true WHERE id = $1", userID)
	tx.Exec("DELETE FROM email_verification_tokens WHERE token = $1", token)
	tx.Commit()

	http.Redirect(w, r, "http://localhost:5173/verify-success", http.StatusSeeOther)
}

func GetProfile(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r)
	if !ok {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Unauthorized"})
		return
	}

	user, err := services.GetUserByID(claims.UserID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}