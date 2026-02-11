package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

func InitJWT() {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// Fallback to a default secret in dev if not set, but warn
		fmt.Println("⚠️  JWT_SECRET environment variable not set. Using a default secret (NOT SECURE FOR PRODUCTION!).")
		jwtSecret = []byte("super-secret-jwt-key-not-for-prod")
	} else {
		jwtSecret = []byte(secret)
	}
}

// Claims defines the JWT claims structure
type Claims struct {
	UserID uint   `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GenerateToken creates a new JWT token for the given user ID and role, valid for 24 hours.
func GenerateToken(userID uint, role string) (string, error) {
	if jwtSecret == nil {
		return "", fmt.Errorf("JWT secret not initialized. Call InitJWT() first")
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		UserID: userID,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "groupie-tracker-api",
			Subject:   fmt.Sprintf("%d", userID),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtSecret)
	if err != nil {
		return "", fmt.Errorf("failed to sign token: %w", err)
	}

	return tokenString, nil
}

// ValidateToken validates the JWT token string and returns the claims if valid.
func ValidateToken(tokenString string) (*Claims, error) {
	if jwtSecret == nil {
		return nil, fmt.Errorf("JWT secret not initialized. Call InitJWT() first")
	}

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return claims, nil
}
