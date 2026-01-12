# 🎤 Knot Crew - Groupie Tracker

Un site web moderne pour découvrir et suivre vos artistes hip-hop/rap préférés, leurs concerts et festivals.

## 🎨 Design

- **Style Chrome/Métallique** inspiré du logo
- **Palette de couleurs** : Noir, Chrome, Cyan, Purple
- **Animations fluides** et effets modernes
- **Responsive** pour tous les écrans

## 🚀 Installation & Lancement

### Backend (Go)

```bash
cd backend
go run main.go
```

Le serveur tourne sur `http://localhost:8080`

### Frontend (React + Vite)

```bash
npm install
npm run dev
```

Le site s'ouvre sur `http://localhost:5173`

## 📋 Fonctionnalités

### ✅ Implémenté

- **Liste d'artistes** avec cartes stylées
- **Recherche** par nom d'artiste ou membre
- **Modal détaillé** pour chaque artiste avec :
  - Informations de base
  - Liste des membres
  - Lieux de concerts
  - Dates de tournée
- **Design moderne** avec effets chrome
- **API Backend Go** avec :
  - Artistes hip-hop (Eminem, Wu-Tang, Travis Scott, etc.)
  - Concerts dans plusieurs villes
  - Endpoints REST

### 🔜 À venir

- Filtres avancés (genre, date, lieu)
- Système de réservation
- Intégration Spotify
- Carte interactive des tournées
- Authentification utilisateur

## 🎯 Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS pur avec animations
- **Backend**: Go (Gin/Gorilla Mux)
- **Database**: SQLite/PostgreSQL avec GORM
- **API**: REST

## 🎨 Personnalisation

Le style est défini dans `src/App.css` avec des variables CSS :

```css
--bg-dark: #0a0a0a;
--accent-cyan: #00d4ff;
--accent-purple: #9b59b6;
```

Modifie ces variables pour changer les couleurs du thème !

## 📸 Screenshots

[Ajoute des captures d'écran ici]

## 🤝 Contribution

N'hésite pas à contribuer en créant des issues ou pull requests !

---

Made with 💜 for hip-hop lovers
