package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
)

var DB *sql.DB
var pool *pgxpool.Pool

func InitDB() error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL environment variable is not set")
	}

	if !strings.Contains(databaseURL, "sslmode=") {
		if strings.Contains(databaseURL, "?") {
			databaseURL += "&sslmode=require"
		} else {
			databaseURL += "?sslmode=require"
		}
	}

	config, err := pgx.ParseConfig(databaseURL)
	if err != nil {
		return fmt.Errorf("error parsing database URL: %w", err)
	}

	log.Println("⏳ Attempting to connect to database...")

	DB = stdlib.OpenDB(*config)

	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)
	DB.SetConnMaxIdleTime(1 * time.Minute)

	maxRetries := 5
	for i := 0; i < maxRetries; i++ {
		err = DB.Ping()
		if err == nil {
			log.Println("✅ Database connection established successfully (SSL enabled)")
			break
		}

		log.Printf("⚠️  Connection attempt %d/%d failed: %v", i+1, maxRetries, err)

		if i < maxRetries-1 {
			waitTime := time.Duration(i+1) * 2 * time.Second
			log.Printf("⏳ Retrying in %v...", waitTime)
			time.Sleep(waitTime)
		}
	}

	if err != nil {
		return fmt.Errorf("❌ could not connect to database after %d attempts: %w", maxRetries, err)
	}

	if err := createTables(); err != nil {
		return fmt.Errorf("error creating tables: %w", err)
	}

	return nil
}

func createTables() error {
	schema := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		name VARCHAR(255),
		role VARCHAR(50) DEFAULT 'user',
		email_verified BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS activity_logs (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
		action TEXT NOT NULL,
		details TEXT,
		ip_address VARCHAR(45),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS artists (
		id SERIAL PRIMARY KEY,
		name TEXT NOT NULL,
		image TEXT,
		bio TEXT,
		members TEXT,
		creation_date INTEGER,
		first_album TEXT,
		locations TEXT,
		concert_dates TEXT,
		relations TEXT
	);

	CREATE TABLE IF NOT EXISTS concerts (
		id SERIAL PRIMARY KEY,
		artist_id INTEGER REFERENCES artists(id) ON DELETE CASCADE,
		name VARCHAR(255) NOT NULL,
		artist_name VARCHAR(255) NOT NULL,
		venue VARCHAR(255) NOT NULL,
		city VARCHAR(100) NOT NULL,
		date TIMESTAMP NOT NULL,
		image_url TEXT,
		standard_price DECIMAL(10,2) NOT NULL,
		vip_price DECIMAL(10,2) NOT NULL,
		available_standard INTEGER DEFAULT 1000,
		available_vip INTEGER DEFAULT 100,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS reservations (
		id SERIAL PRIMARY KEY,
		user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
		concert_id INTEGER REFERENCES concerts(id) ON DELETE CASCADE,
		ticket_type VARCHAR(20) CHECK (ticket_type IN ('standard', 'vip')),
		quantity INTEGER DEFAULT 1,
		total_price DECIMAL(10,2) NOT NULL,
		status VARCHAR(50) DEFAULT 'pending',
		expires_at TIMESTAMP NOT NULL,
		stripe_payment_intent_id TEXT,
		stripe_payment_status VARCHAR(50),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS password_reset_tokens (
		id SERIAL PRIMARY KEY,
		user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
		token TEXT UNIQUE NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		used BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS email_verification_tokens (
		id SERIAL PRIMARY KEY,
		user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
		token TEXT UNIQUE NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
	CREATE INDEX IF NOT EXISTS idx_reservations_concert_id ON reservations(concert_id);
	CREATE INDEX IF NOT EXISTS idx_concerts_date ON concerts(date);
	CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);
	CREATE INDEX IF NOT EXISTS idx_email_verification_token ON email_verification_tokens(token);
	`

	_, err := DB.Exec(schema)
	if err != nil {
		return fmt.Errorf("error creating schema: %w", err)
	}

	log.Println("✅ Database tables created/verified successfully")
	return nil
}

func CloseDB() error {
	if DB != nil {
		return DB.Close()
	}
	return nil
}
