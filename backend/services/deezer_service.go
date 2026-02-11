package services

import (
	"fmt"
	"strings"
)

type DeezerService struct{}

func NewDeezerService() *DeezerService {
	return &DeezerService{}
}

// GetArtistDeezerURL génère l'URL de recherche Deezer pour un artiste
func (s *DeezerService) GetArtistDeezerURL(artistName string) string {
	// Nettoie le nom de l'artiste pour l'URL
	cleanName := strings.ReplaceAll(artistName, " ", "%20")
	return fmt.Sprintf("https://www.deezer.com/search/%s", cleanName)
}

// GetDeezerWidgetURL génère l'URL du widget Deezer pour un artiste
// Format: https://widget.deezer.com/widget/auto/artist/[ARTIST_ID]
func (s *DeezerService) GetDeezerWidgetURL(artistName string) string {
	// Pour l'instant, on retourne l'URL de recherche
	// Plus tard, on pourra mapper les artistes à leurs IDs Deezer
	return s.GetArtistDeezerURL(artistName)
}

// GetDeezerEmbedURL crée une URL embed pour le widget Deezer
func (s *DeezerService) GetDeezerEmbedURL(artistID string) string {
	return fmt.Sprintf("https://widget.deezer.com/widget/dark/artist/%s/top_tracks", artistID)
}

// Mapping manuel des artistes populaires vers leurs IDs Deezer
var deezerArtistIDs = map[string]string{
	"daft punk":        "27",
	"stromae":          "408",
	"david guetta":     "159",
	"orelsan":          "548",
	"pnl":              "6195234",
	"angele":           "8635498",
	"ninho":            "9635624",
	"metallica":        "412",
	"system of a down": "114",
	"gojira":           "6247",
	"rammstein":        "165",
	"the weeknd":       "4050205",
	"dua lipa":         "12246167",
	"dj snake":         "7706720",
	"kavinsky":         "227693",
	"laylow":           "13716822",
	"nekfeu":           "5560188",
	"jul":              "5149294",
	"aya nakamura":     "9635624",
	"soprano":          "412678",
	"booba":            "529",
	"naps":             "8940302",
	"soolking":         "7706716",
	"niska":            "6984045",
	"leto":             "7954344",
	"hamza":            "7954344",
}

// GetArtistDeezerID retourne l'ID Deezer d'un artiste s'il est connu
func (s *DeezerService) GetArtistDeezerID(artistName string) (string, bool) {
	artistKey := strings.ToLower(strings.TrimSpace(artistName))
	id, exists := deezerArtistIDs[artistKey]
	return id, exists
}

// GetArtistEmbedWidget retourne l'URL du widget embed pour un artiste
func (s *DeezerService) GetArtistEmbedWidget(artistName string) string {
	artistID, exists := s.GetArtistDeezerID(artistName)
	if exists {
		return s.GetDeezerEmbedURL(artistID)
	}
	// Si l'artiste n'est pas dans notre mapping, retourne une URL de recherche
	return s.GetArtistDeezerURL(artistName)
}
