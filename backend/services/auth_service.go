package services

import (
	"errors"
	"fmt"
	"os"
	"regexp"
	"time"
	"unicode"

	"groupie-backend/database"
	"groupie-backend/internal/auth" // Import the JWT logic from internal/auth
	"groupie-backend/models"

	"github.com/golang-jwt/jwt/v5" // This import might be removed if only using internal/auth.jwt.Claims
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func isValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func isStrongPassword(password string) error {
	if len(password) < 8 {
		return errors.New("le mot de passe doit faire au moins 8 caractères")
	}

	var hasUpper, hasLower, hasNumber, hasSpecial bool
	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsNumber(char):
			hasNumber = true
		case unicode.IsPunct(char) || unicode.IsSymbol(char):
			hasSpecial = true
		}
	}

	if !hasUpper || !hasLower || !hasNumber || !hasSpecial {
		return errors.New("le mot de passe doit contenir : Majuscule, Minuscule, Chiffre et Caractère spécial")
	}
	return nil
}

func sanitizeInput(input string, maxLength int) string {
	if len(input) > maxLength {
		input = input[:maxLength]
	}
	return input
}

func RegisterUser(req models.RegisterRequest) (*models.User, error) {
	// Validate required fields
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email and password are required")
	}

	req.Email = sanitizeInput(req.Email, 255)
	req.FirstName = sanitizeInput(req.FirstName, 100)
	req.LastName = sanitizeInput(req.LastName, 100)

	if !isValidEmail(req.Email) {
		return nil, errors.New("invalid email format")
	}

	if err := isStrongPassword(req.Password); err != nil {
		return nil, "", err
	}

	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
	if err != nil {
		return nil, errors.New("database error")
	}
	if exists {
		return nil, errors.New("email already registered")
	}

	hashedPassword, err := HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("error processing password")
	}

	var userID int
	var userRole string = "user" // Default role for new registrations
	err = database.DB.QueryRow(
		`INSERT INTO users (email, password_hash, name, role) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id`,
		req.Email, hashedPassword, req.Name, "user",
	).Scan(&userID)

	if err != nil {
		return nil, "", errors.New("échec de la création du compte")
	}

	// Génération du token de vérification
	token := fmt.Sprintf("%x", time.Now().UnixNano())

	// Enregistrement du token en base
	_, err = database.DB.Exec(
		"INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		userID, token, time.Now().Add(24*time.Hour),
	)
	if err != nil {
		fmt.Println("Erreur insertion token:", err)
	}

	errMail := SendVerificationEmail(req.Email, token)
if errMail != nil {
    fmt.Println("❌ ERREUR SMTP RÉELLE :", errMail)
} else {
    fmt.Println("✅ EMAIL ENVOYÉ AVEC SUCCÈS À :", req.Email)
}

	return &models.User{
		ID:        userID,
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      userRole,
	}

	// Generate JWT token
	token, err := auth.GenerateToken(uint(user.ID), user.Role)
	if err != nil {
		return nil, "", errors.New("failed to generate authentication token")
	}, token, nil
}

func LoginUser(req models.LoginRequest) (*models.User, string, error) {
	var user models.User
	var emailVerified bool
	err := database.DB.QueryRow(
		`SELECT id, email, password_hash, first_name, last_name, role, email_verified, created_at 
         FROM users WHERE email = $1`,
		req.Email,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.FirstName, &user.LastName, &user.Role, &emailVerified, &user.CreatedAt)

	if err != nil {
		return nil, "", errors.New("email ou mot de passe incorrect")
	}
	if !CheckPasswordHash(req.Password, user.PasswordHash) {
		return nil, "", errors.New("email ou mot de passe incorrect")
	}

	token, err := GenerateToken(user)
	if err != nil {
		return nil, "", errors.New("authentication failed")
	}

	return &user, token, nil
}

func GetUserByID(userID int) (*models.User, error) {
	var user models.User
	err := database.DB.QueryRow(
		`SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Email, &user.FirstName, &user.LastName, &user.Role, &user.CreatedAt)

	if err != nil {
		return nil, errors.New("utilisateur non trouvé")
	}
	return &user, nil
}