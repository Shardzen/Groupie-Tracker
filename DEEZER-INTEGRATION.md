# 🎵 Intégration Deezer - Groupie Tracker

## 🎯 Vue d'ensemble

Deezer est maintenant intégré dans Groupie Tracker pour permettre l'écoute de musique **sans API** et **sans clés d'authentification** !

## ✨ Fonctionnalités

### Frontend
- ✅ Bouton "Écouter sur Deezer" sur chaque page d'artiste
- ✅ Modal Player avec widget Deezer intégré
- ✅ Fallback vers recherche Deezer si pas de widget disponible
- ✅ Design moderne avec animations

### Backend
- ✅ Service Deezer (`backend/services/deezer_service.go`)
- ✅ Handler Deezer (`backend/handlers/deezer.go`)
- ✅ Route API : `/api/deezer/widget?artist=NomArtiste`
- ✅ Mapping manuel des artistes populaires vers leurs IDs Deezer

## 🚀 Comment ça marche ?

### 1. L'utilisateur clique sur "Écouter sur Deezer"

```typescript
const handleOpenDeezer = () => {
  open({
    artist: artist.name,
    image: artist.image,
  });
};
```

### 2. Le Player s'ouvre et appelle l'API backend

```typescript
fetch(`/api/deezer/widget?artist=${encodeURIComponent(currentTrack.artist)}`)
  .then(res => res.json())
  .then(data => {
    if (data.has_widget) {
      setWidgetUrl(data.widget_url);
    } else {
      setWidgetUrl(data.search_url);
    }
  });
```

### 3. Le backend génère l'URL du widget Deezer

```go
func (s *DeezerService) GetDeezerEmbedURL(artistID string) string {
	return fmt.Sprintf("https://widget.deezer.com/widget/dark/artist/%s/top_tracks", artistID)
}
```

### 4. L'iframe Deezer s'affiche avec les morceaux

```jsx
<iframe
  src="https://widget.deezer.com/widget/dark/artist/27/top_tracks"
  width="100%"
  height="300"
  allow="encrypted-media"
/>
```

## 📋 Artistes avec Widget Deezer

Le backend contient un mapping des artistes populaires incluant Daft Punk, Stromae, David Guetta, Orelsan, PNL, Angèle, Ninho, Metallica, System of a Down, The Weeknd et bien d'autres.

## 🎨 Avantages de Deezer

✅ **Pas d'API** - Aucune clé API nécessaire  
✅ **Gratuit** - Pas de coûts cachés  
✅ **Simple** - Intégration par iframe  
✅ **Légal** - Widgets officiels Deezer  
✅ **Stable** - Pas de problèmes de maintenance comme Spotify  

## 🔧 Ajouter un nouvel artiste
 
Pour ajouter un nouvel artiste avec widget :

1. Trouver l'ID Deezer de l'artiste sur https://www.deezer.com
2. Cherche l'artiste et note l'ID dans l'URL
3. Ajouter dans `backend/services/deezer_service.go` dans le map deezerArtistIDs

## 🎯 API Endpoints

### GET `/api/deezer/widget`

**Query Parameters:**
- `artist` (string, required) - Nom de l'artiste

**Response:**
```json
{
  "widget_url": "https://widget.deezer.com/widget/dark/artist/27/top_tracks",
  "search_url": "https://www.deezer.com/search/daft%20punk",
  "artist_id": "27",
  "has_widget": true
}
```

## 📦 Structure des fichiers

```
backend/
├── services/
│   └── deezer_service.go
├── handlers/
│   └── deezer.go
└── main.go

frontend/
├── src/
│   ├── components/
│   │   └── Player.tsx
│   ├── stores/
│   │   └── usePlayerStore.ts
│   ├── pages/
│   │   └── ArtistDetailPage.tsx
│   └── lib/
│       └── config.ts
```

## 🎉 C'est tout !

Deezer est maintenant opérationnel. Lance ton serveur et profite de la musique ! 🎶

```bash
# Backend
cd backend
go run main.go

# Frontend
cd frontend
npm run dev
```

**Note :** Si un artiste n'a pas de widget configuré, l'utilisateur sera redirigé vers la recherche Deezer pour écouter la musique directement sur leur site.
