#!/bin/bash

echo "🎵 Test de l'intégration Deezer"
echo "================================"
echo ""

echo "📋 Test 1: Vérification des fichiers backend..."
if [ -f "backend/services/deezer_service.go" ]; then
    echo "✅ deezer_service.go existe"
else
    echo "❌ deezer_service.go manquant"
fi

if [ -f "backend/handlers/deezer.go" ]; then
    echo "✅ deezer.go existe"
else
    echo "❌ deezer.go manquant"
fi

echo ""
echo "📋 Test 2: Vérification des fichiers frontend..."
if [ -f "frontend/src/components/Player.tsx" ]; then
    echo "✅ Player.tsx existe"
else
    echo "❌ Player.tsx manquant"
fi

if [ -f "frontend/src/stores/usePlayerStore.ts" ]; then
    echo "✅ usePlayerStore.ts existe"
else
    echo "❌ usePlayerStore.ts manquant"
fi

echo ""
echo "📋 Test 3: Test API Deezer (serveur doit être lancé)..."
echo "Testing: http://localhost:8080/api/deezer/widget?artist=daft%20punk"
response=$(curl -s "http://localhost:8080/api/deezer/widget?artist=daft%20punk" 2>/dev/null)

if [ $? -eq 0 ]; then
    echo "✅ API répond"
    echo "Response: $response"
else
    echo "⚠️  Serveur backend non démarré ou erreur de connexion"
    echo "Lance: cd backend && go run main.go"
fi

echo ""
echo "🎉 Tests terminés !"
