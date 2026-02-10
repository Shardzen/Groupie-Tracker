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
	"strings"
	"groupie-backend/database"
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
		Email   string `json:"email"`
		Name    string `json:"name"`
		Picture string `json:"picture"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&googleUser); err != nil {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_decode_user", http.StatusTemporaryRedirect)
		return
	}

	firstName := googleUser.Name
	lastName := ""
	if parts := strings.SplitN(googleUser.Name, " ", 2); len(parts) > 1 {
		firstName = parts[0]
		lastName = parts[1]
	}

	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, first_name, last_name, email, role, created_at FROM users WHERE email=$1",
		googleUser.Email,
	).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &user.CreatedAt)

	if err != nil {
		err = database.DB.QueryRow(`
            INSERT INTO users (first_name, last_name, email, password_hash, role)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, first_name, last_name, email, role, created_at
        `, firstName, lastName, googleUser.Email, "", "user").
			Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &user.CreatedAt)

		if err != nil {
			fmt.Println("❌ Erreur SQL OAuth:", err)
			http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_create_user", http.StatusTemporaryRedirect)
			return
		}
	}

	jwtToken, err := services.GenerateToken(user)
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