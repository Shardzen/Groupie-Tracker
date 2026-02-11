package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"groupie-backend/database"
	"groupie-backend/models"

	"github.com/sashabaranov/go-openai"
)

type AIRequest struct {
	Prompt string `json:"prompt"`
}

type AISearchRequest struct {
	Query string `json:"query"`
}

// AIRecommendation - Provides personalized concert recommendations
func AIRecommendation(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req AIRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		// Fallback to mock response if no API key
		json.NewEncoder(w).Encode(map[string]interface{}{
			"recommendation": "Based on your preferences, we recommend checking out our featured artists!",
		})
		return
	}

	// Get available artists and concerts from database
	rows, err := database.DB.Query(`
		SELECT a.id, a.name, a.members, c.location, c.date 
		FROM artists a 
		LEFT JOIN concerts c ON a.id = c.artist_id 
		WHERE c.date >= NOW() 
		LIMIT 20
	`)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var contextData string
	for rows.Next() {
		var id int
		var name, members, location, date string
		if err := rows.Scan(&id, &name, &members, &location, &date); err != nil {
			continue
		}
		contextData += fmt.Sprintf("Artist: %s, Members: %s, Concert: %s on %s\n", name, members, location, date)
	}

	client := openai.NewClient(apiKey)

	systemPrompt := fmt.Sprintf(`You are a music recommendation assistant for Groupie Tracker, a concert booking platform. 
	
Available concerts and artists:
%s

Provide personalized, enthusiastic concert recommendations based on user preferences. 
Be specific about artists, dates, and locations from the available data.
Keep responses concise (2-3 sentences) and engaging.`, contextData)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4oMini,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: req.Prompt,
				},
			},
			Temperature: 0.7,
			MaxTokens:   200,
		},
	)

	if err != nil {
		http.Error(w, "AI service unavailable", http.StatusServiceUnavailable)
		return
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"recommendation": resp.Choices[0].Message.Content,
	})
}

// AISearch - Intelligent search using natural language
func AISearch(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var req AISearchRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	apiKey := os.Getenv("OPENAI_API_KEY")
	if apiKey == "" {
		// Fallback to basic search
		simpleSearch(w, r, req.Query)
		return
	}

	// Get all artists and concerts
	rows, err := database.DB.Query(`
		SELECT 
			a.id, a.name, a.members, a.creation_date, a.first_album,
			a.image, a.locations, a.concert_dates,
			c.id as concert_id, c.location as concert_location, 
			c.date as concert_date, c.available_tickets, c.price
		FROM artists a
		LEFT JOIN concerts c ON a.id = c.artist_id
		ORDER BY a.name
	`)
	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type ArtistData struct {
		ID           int
		Name         string
		Members      string
		CreationDate int
		FirstAlbum   string
		Image        string
		Locations    string
		ConcertDates string
		Concerts     []map[string]interface{}
	}

	artistMap := make(map[int]*ArtistData)

	for rows.Next() {
		var (
			id, creationDate                 int
			name, members, firstAlbum, image string
			locations, concertDates          string
			concertID                        *int
			concertLocation, concertDate     *string
			availableTickets                 *int
			price                            *float64
		)

		err := rows.Scan(
			&id, &name, &members, &creationDate, &firstAlbum,
			&image, &locations, &concertDates,
			&concertID, &concertLocation, &concertDate, &availableTickets, &price,
		)
		if err != nil {
			continue
		}

		if _, exists := artistMap[id]; !exists {
			artistMap[id] = &ArtistData{
				ID:           id,
				Name:         name,
				Members:      members,
				CreationDate: creationDate,
				FirstAlbum:   firstAlbum,
				Image:        image,
				Locations:    locations,
				ConcertDates: concertDates,
				Concerts:     []map[string]interface{}{},
			}
		}

		if concertID != nil {
			concert := map[string]interface{}{
				"id":                *concertID,
				"location":          *concertLocation,
				"date":              *concertDate,
				"available_tickets": *availableTickets,
				"price":             *price,
			}
			artistMap[id].Concerts = append(artistMap[id].Concerts, concert)
		}
	}

	// Convert to JSON for AI context
	artistsJSON, _ := json.Marshal(artistMap)
	contextData := string(artistsJSON)

	client := openai.NewClient(apiKey)

	systemPrompt := fmt.Sprintf(`You are an intelligent search assistant for a concert booking platform.
	
Available data (JSON format):
%s

Based on the user's natural language query, identify the most relevant artists and concerts.
Return ONLY a JSON array of artist IDs that match the query, sorted by relevance.
Format: [1, 5, 12, ...]

Consider:
- Artist names, member names
- Music genres and styles
- Concert locations and dates
- Band formation years
- Album names

Return up to 10 most relevant results.`, contextData)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4oMini,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: fmt.Sprintf("Find artists/concerts matching: %s", req.Query),
				},
			},
			Temperature: 0.3,
			MaxTokens:   100,
		},
	)

	if err != nil {
		simpleSearch(w, r, req.Query)
		return
	}

	// Parse AI response to get artist IDs
	var artistIDs []int
	content := resp.Choices[0].Message.Content
	if err := json.Unmarshal([]byte(content), &artistIDs); err != nil {
		// If AI response is not valid JSON, fall back to simple search
		simpleSearch(w, r, req.Query)
		return
	}

	// Fetch full artist details
	results := []models.Artist{}
	for _, id := range artistIDs {
		if artist, exists := artistMap[id]; exists {
			var fullArtist models.Artist
			fullArtist.ID = artist.ID
			fullArtist.Name = artist.Name
			fullArtist.Image = artist.Image
			fullArtist.CreationDate = artist.CreationDate
			fullArtist.FirstAlbum = artist.FirstAlbum
			json.Unmarshal([]byte(artist.Members), &fullArtist.Members)
			json.Unmarshal([]byte(artist.Locations), &fullArtist.Locations)
			json.Unmarshal([]byte(artist.ConcertDates), &fullArtist.ConcertDates)
			results = append(results, fullArtist)
		}
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"results": results,
		"count":   len(results),
		"query":   req.Query,
	})
}

// simpleSearch - Fallback search without AI
func simpleSearch(w http.ResponseWriter, r *http.Request, query string) {
	rows, err := database.DB.Query(`
		SELECT id, name, image, members, creation_date, first_album, locations, concert_dates, relations
		FROM artists
		WHERE LOWER(name) LIKE LOWER($1) OR LOWER(members) LIKE LOWER($1)
		LIMIT 10
	`, "%"+query+"%")

	if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	artists := []models.Artist{}
	for rows.Next() {
		var artist models.Artist
		var membersJSON, locationsJSON, datesJSON, relationsJSON string
		err := rows.Scan(&artist.ID, &artist.Name, &artist.Image, &membersJSON,
			&artist.CreationDate, &artist.FirstAlbum, &locationsJSON,
			&datesJSON, &relationsJSON)
		if err != nil {
			continue
		}
		json.Unmarshal([]byte(membersJSON), &artist.Members)
		json.Unmarshal([]byte(locationsJSON), &artist.Locations)
		json.Unmarshal([]byte(datesJSON), &artist.ConcertDates)
		json.Unmarshal([]byte(relationsJSON), &artist.Relations)
		artists = append(artists, artist)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"results": artists,
		"count":   len(artists),
		"query":   query,
	})
}
