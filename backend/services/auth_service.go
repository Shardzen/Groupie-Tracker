package services

import (
	"errors"
	"fmt"
	"os"
	"regexp"
	"time"
	"unicode"

	"groupie-backend/database"
	"groupie-backend/models"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

type Claims struct {
	UserID  int    `json:"user_id"`
	Email   string `json:"email"`
	Role    string `json:"role"`
	IsAdmin bool   `json:"is_admin"`
	jwt.RegisteredClaims
}

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		panic("JWT_SECRET environment variable is required")
	}
	return []byte(secret)
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func GenerateToken(user models.User) (string, error) {
	claims := Claims{
		UserID:  user.ID,
		Email:   user.Email,
		Role:    user.Role,
		IsAdmin: user.Role == "admin",
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "ynot-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(getJWTSecret())
}

func ValidateToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return getJWTSecret(), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
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
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email et mot de passe requis")
	}

	req.Email = sanitizeInput(req.Email, 255)
	req.FirstName = sanitizeInput(req.FirstName, 100)
	req.LastName = sanitizeInput(req.LastName, 100)

	if !isValidEmail(req.Email) {
		return nil, errors.New("format d'email invalide")
	}

	if err := isStrongPassword(req.Password); err != nil {
		return nil, err
	}

	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
	if err != nil {
		return nil, errors.New("erreur de base de données")
	}
	if exists {
		return nil, errors.New("cet email est déjà enregistré")
	}

	hashedPassword, err := HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("erreur lors du traitement du mot de passe")
	}

	var userID int
	err = database.DB.QueryRow(
		`INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified) 
        VALUES ($1, $2, $3, $4, $5, $6) 
        RETURNING id`,
		req.Email, hashedPassword, req.FirstName, req.LastName, "user", false,
	).Scan(&userID)

	if err != nil {
		return nil, errors.New("échec de la création du compte")
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
		Role:      "user",
	}, nil
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
	return &user, token, err
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