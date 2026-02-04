package services

import (
	"database/sql"
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

// Validation functions
func isValidEmail(email string) bool {
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}

func isStrongPassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters long")
	}

	var (
		hasUpper   bool
		hasLower   bool
		hasNumber  bool
		hasSpecial bool
	)

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

	if !hasUpper {
		return errors.New("password must contain at least one uppercase letter")
	}
	if !hasLower {
		return errors.New("password must contain at least one lowercase letter")
	}
	if !hasNumber {
		return errors.New("password must contain at least one number")
	}
	if !hasSpecial {
		return errors.New("password must contain at least one special character")
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

	// Sanitize inputs
	req.Email = sanitizeInput(req.Email, 255)
	req.Name = sanitizeInput(req.Name, 255)

	// Validate email format
	if !isValidEmail(req.Email) {
		return nil, errors.New("invalid email format")
	}

	// Validate password strength
	if err := isStrongPassword(req.Password); err != nil {
		return nil, err
	}

	// Check if user already exists
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
	err = database.DB.QueryRow(
		`INSERT INTO users (email, password_hash, name, role) 
		VALUES ($1, $2, $3, $4) 
		RETURNING id`,
		req.Email, hashedPassword, req.Name, "user",
	).Scan(&userID)

	if err != nil {
		return nil, errors.New("failed to create user account")
	}

	user := &models.User{
		ID:    userID,
		Email: req.Email,
		Name:  req.Name,
		Role:  "user",
	}

	return user, nil
}

func LoginUser(req models.LoginRequest) (*models.User, string, error) {
	if req.Email == "" || req.Password == "" {
		return nil, "", errors.New("email and password are required")
	}

	// Sanitize email
	req.Email = sanitizeInput(req.Email, 255)

	var user models.User
	err := database.DB.QueryRow(
		`SELECT id, email, password_hash, name, role, created_at FROM users WHERE email = $1`,
		req.Email,
	).Scan(&user.ID, &user.Email, &user.PasswordHash, &user.Name, &user.Role, &user.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, "", errors.New("invalid email or password")
		}
		return nil, "", errors.New("authentication failed")
	}

	if !CheckPasswordHash(req.Password, user.PasswordHash) {
		return nil, "", errors.New("invalid email or password")
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
		`SELECT id, email, name, role, created_at FROM users WHERE id = $1`,
		userID,
	).Scan(&user.ID, &user.Email, &user.Name, &user.Role, &user.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("user not found")
		}
		return nil, errors.New("database error")
	}

	return &user, nil
}
