# 🎤 KNOT CREW - Groupie Tracker

Une application web moderne de suivi d'artistes hip-hop, rappeurs et festivals avec intégration Spotify.

![KNOT CREW Banner](https://via.placeholder.com/1200x300/000000/00d4ff?text=KNOT+CREW+-+RAP+•+HIP-HOP+•+CONCERTS)

## ✨ Fonctionnalités

- 🎵 **Intégration Spotify** - Écoutez des extraits des artistes directement dans l'app
- 🎪 **Artistes & Festivals** - Découvrez les rappeurs et festivals hip-hop
- 🔍 **Recherche Avancée** - Recherchez par nom d'artiste ou membre
- 🎨 **Design Modern** - Interface élégante avec effets chrome et animations
- 📱 **Responsive** - Fonctionne sur mobile, tablette et desktop
- 🎫 **Concerts** - Consultez les dates et lieux de tournée
- 🎯 **Filtres** - Filtrez entre artistes et festivals

## 🎨 Technologies

- **Frontend**: React + TypeScript + Vite
- **Backend**: Go (Golang)
- **Styling**: CSS moderne avec animations
- **API**: Spotify Embed API
- **Icons**: Emojis natifs

## 📋 Prérequis

- Node.js 18+ et npm
- Go 1.21+ (pour le backend)
- Un navigateur moderne

## 🚀 Installation & Lancement

### 1. Clone le projet

```bash
cd C:\Users\arthu\Desktop\Groupie-Tracker
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Lancer le backend (optionnel)

Le projet fonctionne avec des données de démo même sans backend.

```bash
# Dans un terminal séparé
cd backend
go run main.go
```

Le backend démarre sur http://localhost:8080

### 4. Lancer le frontend

```bash
npm run dev
```

Le frontend démarre sur http://localhost:5173

## 🎵 Artistes Inclus

### Rappeurs
- **Kendrick Lamar** - Pionnier du hip-hop conscient
- **Drake** - Superstar canadienne du rap
- **Travis Scott** - Maître des beats psychédéliques
- **J. Cole** - Poète du rap moderne
- **Tyler, The Creator** - Créateur visionnaire
- **Megan Thee Stallion** - Reine du rap féminin
- **Lil Baby** - Rising star d'Atlanta
- **21 Savage** - Légende d'Atlanta/Londres
- **Baby Keem** - Nouvelle génération

### Festivals
- **Rolling Loud** - Le plus grand festival hip-hop au monde
- **Coachella** - Festival légendaire multi-genres
- **Wireless Festival** - Le temple du hip-hop UK

## 🎨 Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `src/App.css` :

```css
:root {
  --bg-dark: #0a0a0a;
  --accent-cyan: #00d4ff;
  --accent-purple: #9b59b6;
  --accent-gold: #ffd700;
}
```

### Ajouter des artistes

Modifiez le tableau d'artistes dans `src/App.tsx` :

```typescript
{
  id: 13,
  name: "Nouvel Artiste",
  image: "URL_IMAGE",
  members: ["Nom du membre"],
  creationDate: 2024,
  firstAlbum: "Premier Album - 2024",
  locations: ["Ville, Pays"],
  concertDates: ["2025-12-31"],
  relations: {},
  spotifyId: "SPOTIFY_ARTIST_ID", // Optionnel
  genre: "Hip-Hop" // ou "Festival"
}
```

### Trouver un Spotify Artist ID

1. Allez sur [Spotify Web Player](https://open.spotify.com)
2. Cherchez l'artiste
3. Copiez l'ID depuis l'URL : `open.spotify.com/artist/[ID]`

## 📁 Structure du Projet

```
Groupie-Tracker/
├── src/
│   ├── App.tsx          # Composant principal
│   ├── App.css          # Styles personnalisés
│   ├── main.tsx         # Point d'entrée
│   └── components/      # Composants React
├── backend/             # API Go (optionnel)
├── public/              # Assets statiques
├── package.json         # Dépendances npm
└── README.md           # Ce fichier
```

## 🎯 Fonctionnalités Avancées

### Recherche
- Recherche par nom d'artiste
- Recherche par nom de membre
- Recherche en temps réel

### Filtres
- Tous les résultats
- Uniquement les artistes
- Uniquement les festivals

### Modal Détails
- Image haute résolution
- Player Spotify intégré (si disponible)
- Liste des membres/lineup
- Lieux de tournée avec emojis
- Dates de concerts formatées
- Boutons d'action (tickets, rappels)

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier Go
go version

# Réinstaller les dépendances
cd backend
go mod download
```

### Le frontend ne charge pas
```bash
# Nettoyer le cache
npm cache clean --force

# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Spotify ne s'affiche pas
- Vérifiez que le `spotifyId` est correct
- Vérifiez votre connexion internet
- Certains artistes peuvent bloquer l'embed

## 📝 Scripts Disponibles

```bash
npm run dev          # Lance le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualise le build
npm run lint         # Vérifie le code
```

## 🎨 Design Features

- **Effet Chrome** sur le logo
- **Glassmorphism** sur les cards
- **Animations fluides** au hover
- **Gradients dynamiques**
- **Scroll personnalisé**
- **Responsive design**

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📜 License

Ce projet est sous licence MIT.

## 👥 Auteurs

- **KNOT CREW Team** - Développement initial

## 🙏 Remerciements

- Spotify pour leur API Embed
- Unsplash pour les images
- La communauté React
- Tous les artistes inclus

## 🔗 Liens Utiles

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Spotify Embed API](https://developer.spotify.com/documentation/embeds)
- [TypeScript Documentation](https://www.typescriptlang.org)

---

**Made with ❤️ by KNOT CREW**

*RAP • HIP-HOP • CONCERTS • FESTIVALS*
