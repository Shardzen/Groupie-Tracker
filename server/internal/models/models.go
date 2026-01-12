package models

import (
	"time"

	"gorm.io/gorm"
)

// User représente un utilisateur de l'application
type User struct {
	ID        uint           `gorm:"primarykey" json:"id"`
	Email     string         `gorm:"uniqueIndex;not null" json:"email"`
	Password  string         `gorm:"not null" json:"-"` // Ne pas exposer en JSON
	FirstName string         `json:"firstName"`
	LastName  string         `json:"lastName"`
	Role      string         `gorm:"default:user" json:"role"` // user, admin
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Artist représente un artiste/groupe
type Artist struct {
	ID           uint      `gorm:"primarykey" json:"id"`
	Name         string    `gorm:"not null" json:"name"`
	Image        string    `json:"image"`
	Members      []string  `gorm:"type:text[]" json:"members"`
	CreationDate int       `json:"creationDate"`
	FirstAlbum   string    `json:"firstAlbum"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// Location représente un lieu de concert
type Location struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	City      string    `gorm:"not null" json:"city"`
	Country   string    `gorm:"not null" json:"country"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	CreatedAt time.Time `json:"createdAt"`
}

// Concert représente une date de concert
type Concert struct {
	ID         uint      `gorm:"primarykey" json:"id"`
	ArtistID   uint      `gorm:"not null" json:"artistId"`
	Artist     Artist    `json:"artist"`
	LocationID uint      `gorm:"not null" json:"locationId"`
	Location   Location  `json:"location"`
	Date       time.Time `gorm:"not null" json:"date"`
	TicketURL  string    `json:"ticketUrl"`
	CreatedAt  time.Time `json:"createdAt"`
}

// Favorite représente un artiste favori d'un utilisateur
type Favorite struct {
	ID        uint      `gorm:"primarykey" json:"id"`
	UserID    uint      `gorm:"not null" json:"userId"`
	ArtistID  uint      `gorm:"not null" json:"artistId"`
	Artist    Artist    `json:"artist"`
	CreatedAt time.Time `json:"createdAt"`
}
