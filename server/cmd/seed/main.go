package main

import (
	"groupie-tracker/internal/database"
	"groupie-tracker/internal/models"
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func main() {
	// Connexion à la base de données
	if err := database.Connect(); err != nil {
		log.Fatal("Database connection failed:", err)
	}

	// Auto-migration
	database.AutoMigrate(
		&models.User{},
		&models.Artist{},
		&models.Location{},
		&models.Concert{},
		&models.Favorite{},
	)

	log.Println("🌱 Seeding database...")

	// Créer un utilisateur admin
	adminPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	admin := models.User{
		Email:     "admin@groupietracker.com",
		Password:  string(adminPassword),
		FirstName: "Admin",
		LastName:  "User",
		Role:      "admin",
	}
	database.DB.FirstOrCreate(&admin, models.User{Email: admin.Email})
	log.Println("✅ Admin user created")

	// Créer un utilisateur test
	userPassword, _ := bcrypt.GenerateFromPassword([]byte("test123"), bcrypt.DefaultCost)
	user := models.User{
		Email:     "test@example.com",
		Password:  string(userPassword),
		FirstName: "Test",
		LastName:  "User",
		Role:      "user",
	}
	database.DB.FirstOrCreate(&user, models.User{Email: user.Email})
	log.Println("✅ Test user created")

	// Créer des artistes
	artists := []models.Artist{
		{
			Name:         "Kendrick Lamar",
			Image:        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop",
			Members:      []string{"Kendrick Lamar Duckworth"},
			CreationDate: 2003,
			FirstAlbum:   "Section.80 - 2011",
		},
		{
			Name:         "Travis Scott",
			Image:        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=500&fit=crop",
			Members:      []string{"Jacques Berman Webster II"},
			CreationDate: 2008,
			FirstAlbum:   "Owl Pharaoh - 2013",
		},
		{
			Name:         "Drake",
			Image:        "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=500&h=500&fit=crop",
			Members:      []string{"Aubrey Drake Graham"},
			CreationDate: 2006,
			FirstAlbum:   "Thank Me Later - 2010",
		},
		{
			Name:         "J. Cole",
			Image:        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
			Members:      []string{"Jermaine Lamarr Cole"},
			CreationDate: 2007,
			FirstAlbum:   "Cole World - 2011",
		},
		{
			Name:         "The Weeknd",
			Image:        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=500&h=500&fit=crop",
			Members:      []string{"Abel Makkonen Tesfaye"},
			CreationDate: 2009,
			FirstAlbum:   "House of Balloons - 2011",
		},
		{
			Name:         "21 Savage",
			Image:        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&h=500&fit=crop",
			Members:      []string{"Shéyaa Bin Abraham-Joseph"},
			CreationDate: 2013,
			FirstAlbum:   "The Slaughter Tape - 2015",
		},
	}

	for _, artist := range artists {
		database.DB.FirstOrCreate(&artist, models.Artist{Name: artist.Name})
	}
	log.Println("✅ 6 Artists created")

	// Créer des locations
	locations := []models.Location{
		{City: "Los Angeles", Country: "USA", Latitude: 34.0522, Longitude: -118.2437},
		{City: "New York", Country: "USA", Latitude: 40.7128, Longitude: -74.0060},
		{City: "Paris", Country: "France", Latitude: 48.8566, Longitude: 2.3522},
		{City: "London", Country: "UK", Latitude: 51.5074, Longitude: -0.1278},
		{City: "Tokyo", Country: "Japan", Latitude: 35.6762, Longitude: 139.6503},
		{City: "Toronto", Country: "Canada", Latitude: 43.6532, Longitude: -79.3832},
	}

	for _, location := range locations {
		database.DB.FirstOrCreate(&location, models.Location{City: location.City, Country: location.Country})
	}
	log.Println("✅ 6 Locations created")

	// Créer des concerts
	var savedArtists []models.Artist
	database.DB.Find(&savedArtists)

	var savedLocations []models.Location
	database.DB.Find(&savedLocations)

	if len(savedArtists) > 0 && len(savedLocations) > 0 {
		concerts := []models.Concert{
			{
				ArtistID:   savedArtists[0].ID,
				LocationID: savedLocations[0].ID,
				Date:       time.Now().AddDate(0, 2, 15),
				TicketURL:  "https://tickets.example.com/kendrick-la",
			},
			{
				ArtistID:   savedArtists[1].ID,
				LocationID: savedLocations[1].ID,
				Date:       time.Now().AddDate(0, 3, 20),
				TicketURL:  "https://tickets.example.com/travis-ny",
			},
			{
				ArtistID:   savedArtists[2].ID,
				LocationID: savedLocations[2].ID,
				Date:       time.Now().AddDate(0, 4, 10),
				TicketURL:  "https://tickets.example.com/drake-paris",
			},
		}

		for _, concert := range concerts {
			database.DB.Create(&concert)
		}
		log.Println("✅ 3 Concerts created")
	}

	log.Println("\n🎉 Database seeded successfully!")
	log.Println("\n📝 Test credentials:")
	log.Println("   👨‍💼 Admin: admin@groupietracker.com / admin123")
	log.Println("   👤 User:  test@example.com / test123")
}
