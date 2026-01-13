package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		return fmt.Errorf("DATABASE_URL environment variable is not set")
	}

	var err error
	DB, err = sql.Open("postgres", databaseURL)
	if err != nil {
		return fmt.Errorf("error opening database: %w", err)
	}

	if err = DB.Ping(); err != nil {
		return fmt.Errorf("error connecting to database: %w", err)
	}

	log.Println("✅ Database connection established successfully")

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
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE TABLE IF NOT EXISTS concerts (
		id SERIAL PRIMARY KEY,
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
		stripe_payment_intent_id TEXT,
		stripe_payment_status VARCHAR(50),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);

	CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
	CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);
	CREATE INDEX IF NOT EXISTS idx_reservations_concert_id ON reservations(concert_id);
	CREATE INDEX IF NOT EXISTS idx_concerts_date ON concerts(date);
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
