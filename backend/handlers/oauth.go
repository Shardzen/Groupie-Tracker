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
	"groupie-backend/internal/auth" 
	"groupie-backend/models"
	"net/url"
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
		Secure:   false, 
		Path:     "/",     
		SameSite: http.SameSiteLaxMode, 
	})

	authURL := googleOauthConfig.AuthCodeURL(state, oauth2.AccessTypeOffline)
	http.Redirect(w, r, authURL, http.StatusTemporaryRedirect)
}

func GoogleCallback(w http.ResponseWriter, r *http.Request) {
	fmt.Println("🚀 Callback Google reçu...")

	// 1. Échange du Code contre le Token
	code := r.URL.Query().Get("code")
	if code == "" {
		fmt.Println("❌ Pas de code reçu de Google")
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=no_code", http.StatusTemporaryRedirect)
		return
	}

	token, err := googleOauthConfig.Exchange(context.Background(), code)
	if err != nil {
		fmt.Printf("❌ ERREUR ÉCHANGE TOKEN: %v\n", err)
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=token_exchange_failed", http.StatusTemporaryRedirect)
		return
	}

	// 2. Récupération des infos utilisateur chez Google
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

	// 3. Parsing du nom
	firstName := googleUser.Name
	lastName := ""
	if parts := strings.SplitN(googleUser.Name, " ", 2); len(parts) > 1 {
		firstName = parts[0]
		lastName = parts[1]
	}

	// 4. Vérification/Création de l'utilisateur
	var user models.User
	err = database.DB.QueryRow(
		"SELECT id, first_name, last_name, email, role, email_verified, created_at FROM users WHERE email=$1",
		googleUser.Email,
	).Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &user.EmailVerified, &user.CreatedAt)

	if err != nil {
		fmt.Println("🆕 Nouvel utilisateur Google, création...")
		// ✅ L'utilisateur n'existe pas, on le crée avec email_verified = true
		err = database.DB.QueryRow(`
			INSERT INTO users (first_name, last_name, email, password_hash, role, email_verified)
			VALUES ($1, $2, $3, $4, $5, $6)
			RETURNING id, first_name, last_name, email, role, email_verified, created_at
		`, firstName, lastName, googleUser.Email, "", "user", true).
			Scan(&user.ID, &user.FirstName, &user.LastName, &user.Email, &user.Role, &user.EmailVerified, &user.CreatedAt)

		if err != nil {
			fmt.Println("❌ Erreur SQL:", err)
			http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_create_user", http.StatusTemporaryRedirect)
			return
		}
	}

	// 5. Génération JWT et redirection
	jwtToken, err := auth.GenerateToken(uint(user.ID), user.Role)
	if err != nil {
		http.Redirect(w, r, os.Getenv("FRONTEND_URL")+"?error=failed_to_generate_token", http.StatusTemporaryRedirect)
		return
	}

	userJSON, _ := json.Marshal(user)
	encodedUser := url.QueryEscape(string(userJSON))

	fURL := os.Getenv("FRONTEND_URL")
	if fURL == "" { 
		fURL = "http://localhost:5173" 
	}

	redirectURL := fmt.Sprintf("%s/login?token=%s&user=%s", fURL, jwtToken, encodedUser)
	fmt.Println("✅ Connexion Google réussie, redirection vers le front !")
	http.Redirect(w, r, redirectURL, http.StatusTemporaryRedirect)
}
