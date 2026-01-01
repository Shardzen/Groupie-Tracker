package main

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func InitDB() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgresql://neondb_owner:npg_GI5FZANzQ3cT@ep-restless-glitter-abp35se3-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
	}

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schema
	err = DB.AutoMigrate(
		&User{},
		&Artist{},
		&ArtistMember{},
		&Concert{},
		&PasswordReset{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	log.Println("Database connected and migrated successfully")
}
