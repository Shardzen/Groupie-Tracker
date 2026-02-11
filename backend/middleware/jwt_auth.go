package middleware

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"groupie-backend/internal/auth" // Import the JWT logic
)

// UserClaimsKey is a custom type for context key to avoid collisions
type UserClaimsKey string

const userClaimsKey UserClaimsKey = "userClaims"

// JWTAuth middleware verifies the JWT token from the Authorization header.
// If valid, it saves the user claims in the request context.
func JWTAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			log.Println("❌ JWTAuth: Authorization header missing")
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Authorization header missing"})
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			log.Println("❌ JWTAuth: Invalid Authorization header format")
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid Authorization header format"})
			return
		}

		tokenString := parts[1]
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			log.Printf("❌ JWTAuth: Token validation failed: %v", err)
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Invalid or expired token"})
			return
		}

		// Store claims in context
		ctx := context.WithValue(r.Context(), userClaimsKey, claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// GetUserFromContext retrieves user claims from the request context.
func GetUserFromContext(r *http.Request) (*auth.Claims, bool) {
	claims, ok := r.Context().Value(userClaimsKey).(*auth.Claims)
	return claims, ok
}

// AdminOnly middleware checks if the user in context has an 'admin' role.
func AdminOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		claims, ok := GetUserFromContext(r)
		if !ok || claims.Role != "admin" {
			log.Println("❌ AdminOnly: Admin access required")
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusForbidden)
			json.NewEncoder(w).Encode(map[string]string{"error": "Admin access required"})
			return
		}
		next.ServeHTTP(w, r)
	})
}
