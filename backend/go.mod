module groupie-backend

go 1.25.0

require (
	github.com/golang-jwt/jwt/v5 v5.3.0
	github.com/gorilla/mux v1.8.1
	github.com/joho/godotenv v1.5.1
	github.com/lib/pq v1.10.9
	github.com/rs/cors v1.11.1
	github.com/sashabaranov/go-openai v1.41.2
	github.com/stripe/stripe-go/v76 v76.25.0
	golang.org/x/crypto v0.47.0
)

require github.com/stripe/stripe-go/v74 v74.30.0 // indirect
