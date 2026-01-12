# Groupie Tracker - Backend
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY go.mod go.sum ./
RUN go mod download

# Copier le code source
COPY . .

# Build l'application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/api

# Image finale légère
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copier le binaire depuis l'étape de build
COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
