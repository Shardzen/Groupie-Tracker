package handlers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"groupie-backend/database"
	"groupie-backend/internal/auth" // Import the JWT logic
	"groupie-backend/models"
	"groupie-backend/services"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var googleOauthConfig *oauth2.Config

func InitOAuth() {
	googleOauthConfig = &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URI"),
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
}

func generateStateToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func GoogleLogin(w http.ResponseWriter, r *http.Request) {
	state, err := generateStateToken()
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to generate state"})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Expires:  time.Now().Add(10 * time.Minute),
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})

	url := googleOauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"url": url})
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	stateCookie, err := r.Cookie("oauth_state")
	if err != nil || stateCookie.Value != r.URL.Query().Get("state") {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=invalid_state", http.StatusTemporaryRedirect)
		return
	}

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=no_code", http.StatusTemporaryRedirect)
		return
	}

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=token_exchange_failed", http.StatusTemporaryRedirect)
		return
	}

	client := googleOauthConfig.Client(context.Background(), token)
	resp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_get_user_info", http.StatusTemporaryRedirect)
		return
	}
	defer resp.Body.Close()

	var googleUser struct {
		Email         string `json:"email"`
		Name          string `json:"name"`
		Picture       string `json:"picture"`
		VerifiedEmail bool   `json:"verified_email"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_decode_user", http.StatusTemporaryRedirect)
		return
	}

	var user models.User
	err = database.DB.QueryRow("SELECT id, name, email, role, created_at FROM users WHERE email=$1", googleUser.Email).
		Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt)

	if err != nil {
		err = database.DB.QueryRow(`
			INSERT INTO users (name, email, password_hash, role)
			VALUES ($1, $2, $3, $4)
			RETURNING id, name, email, role, created_at
		`, googleUser.Name, googleUser.Email, "", "user").
			Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.CreatedAt)

		if err != nil {
			http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_create_user", http.StatusTemporaryRedirect)
			return
		}
	}

	jwtToken, err := auth.GenerateToken(uint(user.ID), user.Role)
	if err != nil {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_generate_token", http.StatusTemporaryRedirect)
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	redirectURL := fmt.Sprintf("%s/auth/callback?token=%s", frontendURL, jwtToken)
	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}

func RequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	var userID int
	err := database.DB.QueryRow("SELECT id FROM users WHERE email=$1", req.Email).Scan(&userID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"message": "If the email exists, a reset link has been sent",
		})
		return
	}

	token := make([]byte, 32)
	rand.Read(token)
	resetToken := base64.URLEncoding.EncodeToString(token)

	expiresAt := time.Now().Add(1 * time.Hour)
	_, err = database.DB.Exec(`
		INSERT INTO password_reset_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id) DO UPDATE SET token=$2, expires_at=$3, used=false
	`, userID, resetToken, expiresAt)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create reset token"})
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	resetURL := fmt.Sprintf("%s/reset-password?token=%s", frontendURL, resetToken)
	err = services.SendEmail(req.Email, "Password Reset", fmt.Sprintf("Click here to reset your password: %s", resetURL))
	if err != nil {
		fmt.Printf("Failed to send email: %v\n", err)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "If the email exists, a reset link has been sent",
	})
}

func ResetPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	var userID int
	var expiresAt time.Time
	var used bool
	err := database.DB.QueryRow(`
		SELECT user_id, expires_at, used 
		FROM password_reset_tokens 
		WHERE token=$1
	`, req.Token).Scan(&userID, &expiresAt, &used)

	if err != nil || used || time.Now().After(expiresAt) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid or expired token"})
		return
	}

	hashedPassword, err := services.HashPassword(req.NewPassword)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to hash password"})
		return
	}

	_, err = database.DB.Exec("UPDATE users SET password_hash=$1 WHERE id=$2", hashedPassword, userID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update password"})
		return
	}

	database.DB.Exec("UPDATE password_reset_tokens SET used=true WHERE token=$1", req.Token)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Password reset successfully",
	})
}

func SendVerificationEmail(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	var userID int
	var emailVerified bool
	err := database.DB.QueryRow("SELECT id, email_verified FROM users WHERE email=$1", req.Email).
		Scan(&userID, &emailVerified)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	if emailVerified {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"message": "Email already verified"})
		return
	}

	token := make([]byte, 32)
	rand.Read(token)
	verificationToken := base64.URLEncoding.EncodeToString(token)

	expiresAt := time.Now().Add(24 * time.Hour)
	_, err = database.DB.Exec(`
		INSERT INTO email_verification_tokens (user_id, token, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id) DO UPDATE SET token=$2, expires_at=$3
	`, userID, verificationToken, expiresAt)

	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to create verification token"})
		return
	}

	frontendURL := os.Getenv("FRONTEND_URL")
	if frontendURL == "" {
		frontendURL = "http://localhost:5173"
	}

	verifyURL := fmt.Sprintf("%s/verify-email?token=%s", frontendURL, verificationToken)
	err = services.SendEmail(req.Email, "Verify Your Email", fmt.Sprintf("Click here to verify your email: %s", verifyURL))
	if err != nil {
		fmt.Printf("Failed to send verification email: %v\n", err)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Verification email sent",
	})
}

func VerifyEmail(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Token required"})
		return
	}

	var userID int
	var expiresAt time.Time
	err := database.DB.QueryRow(`
		SELECT user_id, expires_at 
		FROM email_verification_tokens 
		WHERE token=$1
	`, token).Scan(&userID, &expiresAt)

	if err != nil || time.Now().After(expiresAt) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid or expired token"})
		return
	}

	_, err = database.DB.Exec("UPDATE users SET email_verified=true WHERE id=$1", userID)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to verify email"})
		return
	}

	database.DB.Exec("DELETE FROM email_verification_tokens WHERE token=$1", token)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"message": "Email verified successfully",
	})
}
