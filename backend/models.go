package main

import (
	"time"
)

type User struct {
	ID                uint       `gorm:"primaryKey" json:"id"`
	Email             string     `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash      *string    `json:"-"`                    // Nullable for OAuth
	GoogleID          *string    `gorm:"uniqueIndex" json:"-"` // Nullable for email/password
	FirstName         string     `json:"first_name"`
	LastName          string     `json:"last_name"`
	IsAdmin           bool       `gorm:"default:false" json:"is_admin"`
	IsVerified        bool       `gorm:"default:false" json:"is_verified"`
	VerificationToken *string    `json:"-"`
	ResetToken        *string    `json:"-"`
	ResetTokenExpires *time.Time `json:"-"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
}

type Artist struct {
	ID             uint           `gorm:"primaryKey" json:"id"`
	Name           string         `gorm:"not null" json:"name"`
	ImageURL       string         `gorm:"type:text" json:"image_url"`
	Bio            string         `gorm:"type:text" json:"bio"`
	Genre          string         `json:"genre"`
	CreationDate   int            `json:"creation_date"`
	FirstAlbum     string         `json:"first_album"`
	SpotifyID      string         `json:"spotify_id"`
	MusicSampleURL string         `gorm:"type:text" json:"music_sample_url"`
	CreatedAt      time.Time      `json:"created_at"`
	UpdatedAt      time.Time      `json:"updated_at"`
	Members        []ArtistMember `gorm:"foreignKey:ArtistID" json:"members,omitempty"`
	Concerts       []Concert      `gorm:"foreignKey:ArtistID" json:"concerts,omitempty"`
}

type ArtistMember struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	ArtistID uint   `gorm:"not null" json:"artist_id"`
	Name     string `gorm:"not null" json:"name"`
	Role     string `json:"role"`
	Order    int    `json:"order"`
	Artist   Artist `gorm:"foreignKey:ArtistID" json:"-"`
}

type Concert struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	ArtistID         uint      `gorm:"not null" json:"artist_id"`
	Location         string    `gorm:"not null" json:"location"`
	Venue            string    `json:"venue"`
	City             string    `gorm:"not null" json:"city"`
	Country          string    `gorm:"not null" json:"country"`
	Date             time.Time `gorm:"not null" json:"date"`
	Price            float64   `gorm:"type:decimal(10,2);not null" json:"price"`
	TotalTickets     int       `gorm:"not null" json:"total_tickets"`
	AvailableTickets int       `gorm:"not null" json:"available_tickets"`
	Status           string    `gorm:"type:enum('upcoming','cancelled','completed');default:'upcoming'" json:"status"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	Artist           Artist    `gorm:"foreignKey:ArtistID" json:"artist,omitempty"`
}

type PasswordReset struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `gorm:"not null" json:"user_id"`
	Token     string    `gorm:"uniqueIndex;not null" json:"token"`
	ExpiresAt time.Time `gorm:"not null" json:"expires_at"`
	Used      bool      `gorm:"default:false" json:"used"`
	CreatedAt time.Time `json:"created_at"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
}
