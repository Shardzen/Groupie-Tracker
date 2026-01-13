package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/sashabaranov/go-openai"
)

type AIRequest struct {
	Prompt string `json:"prompt"`
}

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
			"recommendation": "Based on your listening history, we recommend checking out Queen's Bohemian Rhapsody concert in Paris!",
		})
		return
	}

	client := openai.NewClient(apiKey)
	
	// Create completion request
	resp, err := client.CreateChatCompletion(
		r.Context(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: "You are a music recommendation assistant for a concert booking platform. Provide personalized concert recommendations based on user preferences.",
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: req.Prompt,
				},
			},
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
