#!/bin/bash

echo "🚀 Building Groupie Tracker Backend..."

cd backend

echo "📦 Downloading Go dependencies..."
go mod download

echo "🔨 Building binary..."
go build -o groupie-tracker-api main.go

echo "✅ Build complete! Run with: ./backend/groupie-tracker-api"
