package services

import (
	"strings"
	"time"

	"groupie-backend/models"
)

type ArtistService struct {
	artists  []models.Artist
	concerts []models.Concert
}

func NewArtistService() *ArtistService {
	s := &ArtistService{}
	s.initMockData()
	return s
}

func (s *ArtistService) GetAll() []models.Artist {
	return s.artists
}

func (s *ArtistService) GetByID(id int) (models.Artist, bool) {
	for _, artist := range s.artists {
		if artist.ID == id {
			return artist, true
		}
	}
	return models.Artist{}, false
}

func (s *ArtistService) GetAllConcerts() []models.Concert {
	return s.concerts
}

func (s *ArtistService) SearchConcerts(query string) []models.Concert {
	if query == "" {
		return s.concerts
	}

	var results []models.Concert
	lowerQuery := strings.ToLower(query)
	
	for _, concert := range s.concerts {
		if strings.Contains(strings.ToLower(concert.Venue), lowerQuery) ||
		   strings.Contains(strings.ToLower(concert.City), lowerQuery) ||
		   strings.Contains(strings.ToLower(concert.ArtistName), lowerQuery) {
			results = append(results, concert)
		}
	}
	
	return results
}

func (s *ArtistService) initMockData() {
	s.artists = []models.Artist{
		{
			ID:           1,
			Name:         "Queen",
			Image:        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
			Bio:          "Legendary British rock band formed in 1970, known for hits like 'Bohemian Rhapsody' and 'We Will Rock You'.",
			Members:      []string{"Freddie Mercury", "Brian May", "Roger Taylor", "John Deacon"},
			CreationDate: 1970,
			FirstAlbum:   "Queen (1973)",
			Locations:    []string{"Paris, France", "London, UK", "New York, USA"},
			ConcertDates: []string{"15 mars 2026", "22 avril 2026", "10 juin 2026"},
		},
		{
			ID:           2,
			Name:         "Pink Floyd",
			Image:        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400",
			Bio:          "Progressive rock pioneers known for concept albums like 'The Dark Side of the Moon' and 'The Wall'.",
			Members:      []string{"David Gilmour", "Roger Waters", "Richard Wright", "Nick Mason"},
			CreationDate: 1965,
			FirstAlbum:   "The Piper at the Gates of Dawn (1967)",
			Locations:    []string{"Berlin, Germany", "Amsterdam, Netherlands", "Sydney, Australia"},
			ConcertDates: []string{"28 février 2026", "15 mai 2026"},
		},
		{
			ID:           3,
			Name:         "Led Zeppelin",
			Image:        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
			Bio:          "Iconic hard rock band that defined the sound of the 1970s with classics like 'Stairway to Heaven'.",
			Members:      []string{"Robert Plant", "Jimmy Page", "John Paul Jones", "John Bonham"},
			CreationDate: 1968,
			FirstAlbum:   "Led Zeppelin (1969)",
			Locations:    []string{"New York, USA", "Los Angeles, USA", "Chicago, USA"},
			ConcertDates: []string{"1 juin 2026", "20 juillet 2026"},
		},
		{
			ID:           4,
			Name:         "The Beatles",
			Image:        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400",
			Bio:          "The most influential band in history, revolutionizing popular music in the 1960s.",
			Members:      []string{"John Lennon", "Paul McCartney", "George Harrison", "Ringo Starr"},
			CreationDate: 1960,
			FirstAlbum:   "Please Please Me (1963)",
			Locations:    []string{"Tokyo, Japan", "Liverpool, UK", "Hamburg, Germany"},
			ConcertDates: []string{"25 juillet 2026", "10 septembre 2026"},
		},
		{
			ID:           5,
			Name:         "Nirvana",
			Image:        "https://images.unsplash.com/photo-1501612780327-45045538702b?w=400",
			Bio:          "Grunge legends who brought alternative rock to the mainstream in the early 1990s.",
			Members:      []string{"Kurt Cobain", "Krist Novoselic", "Dave Grohl"},
			CreationDate: 1987,
			FirstAlbum:   "Bleach (1989)",
			Locations:    []string{"Los Angeles, USA", "Seattle, USA", "Portland, USA"},
			ConcertDates: []string{"5 avril 2026", "18 mai 2026"},
		},
		{
			ID:           6,
			Name:         "Radiohead",
			Image:        "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400",
			Bio:          "Alternative rock innovators known for pushing musical boundaries since the 1990s.",
			Members:      []string{"Thom Yorke", "Jonny Greenwood", "Colin Greenwood", "Ed O'Brien", "Philip Selway"},
			CreationDate: 1985,
			FirstAlbum:   "Pablo Honey (1993)",
			Locations:    []string{"Manchester, UK", "Barcelona, Spain", "Montreal, Canada"},
			ConcertDates: []string{"12 mars 2026", "30 juin 2026"},
		},
		{
			ID:           7,
			Name:         "AC/DC",
			Image:        "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400",
			Bio:          "High-voltage rock legends from Australia, dominating stages since the 1970s.",
			Members:      []string{"Angus Young", "Brian Johnson", "Cliff Williams", "Phil Rudd"},
			CreationDate: 1973,
			FirstAlbum:   "High Voltage (1975)",
			Locations:    []string{"Melbourne, Australia", "Rio de Janeiro, Brazil", "Madrid, Spain"},
			ConcertDates: []string{"8 février 2026", "14 août 2026"},
		},
		{
			ID:           8,
			Name:         "Metallica",
			Image:        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400",
			Bio:          "Thrash metal pioneers who redefined heavy music in the 1980s and beyond.",
			Members:      []string{"James Hetfield", "Lars Ulrich", "Kirk Hammett", "Robert Trujillo"},
			CreationDate: 1981,
			FirstAlbum:   "Kill 'Em All (1983)",
			Locations:    []string{"San Francisco, USA", "Copenhagen, Denmark", "Mexico City, Mexico"},
			ConcertDates: []string{"20 mars 2026", "5 septembre 2026"},
		},
	}

	s.concerts = []models.Concert{
		{
			ID:                1,
			Name:              "Queen Live Experience",
			ArtistID:          1,
			ArtistName:        "Queen",
			Venue:             "Stade de France",
			City:              "Paris",
			Date:              time.Now().AddDate(0, 2, 0),
			ImageURL:          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
			StandardPrice:     89.99,
			VIPPrice:          199.99,
			AvailableStandard: 150,
			AvailableVIP:      50,
			CreatedAt:         time.Now(),
		},
		{
			ID:                2,
			Name:              "Queen UK Tour",
			ArtistID:          1,
			ArtistName:        "Queen",
			Venue:             "Wembley Stadium",
			City:              "London",
			Date:              time.Now().AddDate(0, 3, 5),
			ImageURL:          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
			StandardPrice:     95.50,
			VIPPrice:          215.00,
			AvailableStandard: 200,
			AvailableVIP:      75,
			CreatedAt:         time.Now(),
		},
		{
			ID:                3,
			Name:              "Pink Floyd: The Endless River",
			ArtistID:          2,
			ArtistName:        "Pink Floyd",
			Venue:             "Mercedes-Benz Arena",
			City:              "Berlin",
			Date:              time.Now().AddDate(0, 1, 15),
			ImageURL:          "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800",
			StandardPrice:     110.00,
			VIPPrice:          250.00,
			AvailableStandard: 100,
			AvailableVIP:      40,
			CreatedAt:         time.Now(),
		},
		{
			ID:                4,
			Name:              "Led Zeppelin Reunion",
			ArtistID:          3,
			ArtistName:        "Led Zeppelin",
			Venue:             "Madison Square Garden",
			City:              "New York",
			Date:              time.Now().AddDate(0, 4, 0),
			ImageURL:          "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
			StandardPrice:     120.00,
			VIPPrice:          280.00,
			AvailableStandard: 250,
			AvailableVIP:      100,
			CreatedAt:         time.Now(),
		},
		{
			ID:                5,
			Name:              "The Beatles Tribute",
			ArtistID:          4,
			ArtistName:        "The Beatles",
			Venue:             "Tokyo Dome",
			City:              "Tokyo",
			Date:              time.Now().AddDate(0, 5, 10),
			ImageURL:          "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800",
			StandardPrice:     130.00,
			VIPPrice:          300.00,
			AvailableStandard: 180,
			AvailableVIP:      80,
			CreatedAt:         time.Now(),
		},
		{
			ID:                6,
			Name:              "Nirvana Unplugged Revival",
			ArtistID:          5,
			ArtistName:        "Nirvana",
			Venue:             "Hollywood Bowl",
			City:              "Los Angeles",
			Date:              time.Now().AddDate(0, 2, 20),
			ImageURL:          "https://images.unsplash.com/photo-1501612780327-45045538702b?w=800",
			StandardPrice:     75.00,
			VIPPrice:          175.00,
			AvailableStandard: 120,
			AvailableVIP:      60,
			CreatedAt:         time.Now(),
		},
	}
}
