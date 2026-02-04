# 🚀 Guide de Démarrage Rapide - Deezer Integration

## Étape 1: Backend

```bash
cd backend
go run main.go
```

Le serveur démarre sur `http://localhost:8080`

Tu verras dans les logs :
```
🎵 Deezer Widget: /api/deezer/widget
```

## Étape 2: Frontend

Dans un nouveau terminal :

```bash
cd frontend
npm run dev
```

Le frontend démarre sur `http://localhost:5173`

## Étape 3: Tester

1. Ouvre ton navigateur sur `http://localhost:5173`
2. Clique sur un artiste (ex: Daft Punk, Stromae, Orelsan)
3. Sur la page de l'artiste, clique sur le bouton **"ÉCOUTER SUR DEEZER"**
4. Un modal s'ouvre avec le lecteur Deezer intégré ! 🎵

## 🎯 Test direct de l'API

Tu peux tester l'API directement dans ton navigateur :

```
http://localhost:8080/api/deezer/widget?artist=daft%20punk
```

Tu devrais voir :
```json
{
  "widget_url": "https://widget.deezer.com/widget/dark/artist/27/top_tracks",
  "search_url": "https://www.deezer.com/search/daft%20punk",
  "artist_id": "27",
  "has_widget": true
}
```

## 🎵 Artistes testés et fonctionnels

- ✅ Daft Punk
- ✅ Stromae
- ✅ David Guetta
- ✅ Orelsan
- ✅ PNL
- ✅ Angèle
- ✅ Ninho
- ✅ Metallica
- ✅ The Weeknd

## 🔧 Résolution de problèmes

### Le widget ne s'affiche pas ?
- Vérifie que le backend est bien lancé
- Vérifie la console du navigateur pour des erreurs CORS
- Assure-toi que l'artiste est bien dans le mapping (voir `deezer_service.go`)

### CORS error ?
Le fichier `main.go` contient déjà la configuration CORS pour `localhost:5173`

### L'artiste n'a pas de widget ?
C'est normal ! Tous les artistes ne sont pas dans notre mapping. 
Dans ce cas, un lien vers la recherche Deezer s'affiche à la place.

## 🎉 C'est prêt !

Tu peux maintenant écouter de la musique directement depuis ton application sans aucune API key ! 🚀
