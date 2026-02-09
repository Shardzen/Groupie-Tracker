package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type DeezerHandler struct{}

func NewDeezerHandler() *DeezerHandler {
	return &DeezerHandler{}
}

type DeezerResponse struct {
	WidgetURL string `json:"widget_url"`
	SearchURL string `json:"search_url"`
	ID        int    `json:"id,omitempty"`
	HasWidget bool   `json:"has_widget"`
	Type      string `json:"type"` 
}


type DeezerAPISearch struct {
	Data []struct {
		ID   int    `json:"id"`
		Name string `json:"name,omitempty"` 
		Title string `json:"title,omitempty"`
	} `json:"data"`
}

func (h *DeezerHandler) GetArtistDeezerWidget(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	artistName := r.URL.Query().Get("artist")
	trackTitle := r.URL.Query().Get("track") // On récupère le titre s'il existe

	if artistName == "" {
		http.Error(w, "Artist name is required", http.StatusBadRequest)
		return
	}

	response := DeezerResponse{
		HasWidget: false,
		SearchURL: fmt.Sprintf("https://www.deezer.com/search/%s", url.QueryEscape(artistName)),
	}

	if trackTitle != "" && len(trackTitle) < 50 && trackTitle != fmt.Sprintf("Top titres de %s", artistName) {
		trackID, found := fetchDeezerTrackID(artistName, trackTitle)
		if found {
			response.HasWidget = true
			response.ID = trackID
			response.Type = "track"
			// Widget TRACK (Lecteur simple)
			response.WidgetURL = fmt.Sprintf("https://widget.deezer.com/widget/dark/track/%d", trackID)
			json.NewEncoder(w).Encode(response)
			return
		}
	}

	// CAS 2 : Pas de titre ou titre non trouvé -> On cherche l'Artiste
	artistID, found := fetchDeezerArtistID(artistName)
	if found {
		response.HasWidget = true
		response.ID = artistID
		response.Type = "artist"
		// Widget ARTIST (Playlist des tops titres)
		response.WidgetURL = fmt.Sprintf("https://widget.deezer.com/widget/dark/artist/%d/top_tracks", artistID)
	}

	json.NewEncoder(w).Encode(response)
}

// Cherche l'ID d'un Artiste
func fetchDeezerArtistID(name string) (int, bool) {
	apiURL := fmt.Sprintf("https://api.deezer.com/search/artist?q=%s", url.QueryEscape(name))
	return callDeezerAPI(apiURL)
}

// Cherche l'ID d'une Piste spécifique
func fetchDeezerTrackID(artist string, track string) (int, bool) {
	// Recherche précise : artist:"Nom" track:"Titre"
	query := fmt.Sprintf(`artist:"%s" track:"%s"`, artist, track)
	apiURL := fmt.Sprintf("https://api.deezer.com/search/track?q=%s", url.QueryEscape(query))
	return callDeezerAPI(apiURL)
}

// Fonction générique pour appeler Deezer
func callDeezerAPI(url string) (int, bool) {
	resp, err := http.Get(url)
	if err != nil {
		return 0, false
	}
	defer resp.Body.Close()

	var result DeezerAPISearch
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return 0, false
	}

	if len(result.Data) > 0 {
		return result.Data[0].ID, true
	}
	return 0, false
}