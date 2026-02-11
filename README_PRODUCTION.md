#  Groupie Tracker Advanced

> Plateforme web de réservation de billets de concert avec paiement sécurisé, recherche IA et authentification OAuth, pensée pour une expérience immersive.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Status](https://img.shields.io/badge/status-production-green)
![License](https://img.shields.io/badge/license-MIT-orange)

---

## 📋 Sommaire

- [À propos](#-à-propos)
- [Stack Technique](#-stack-technique)
- [Aperçu](#-aperçu)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Utilisation](#-utilisation)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Tests](#-tests)
- [Déploiement](#-déploiement)
- [Conformité RGPD](#-conformité-rgpd)
- [Équipe](#-équipe)

---

##  À propos

**Groupie Tracker Advanced** est une plateforme web complète de réservation de places de concert, intégrant paiement Stripe, recherche par intelligence artificielle (OpenAI GPT-4), et authentification moderne (JWT + OAuth Google).

### Objectifs principaux

- ✅ Centraliser l'offre de concerts par artiste
- ✅ Proposer une recherche intelligente par IA
- ✅ Offrir un parcours d'achat fluide et sécurisé
- ✅ Garantir la conformité RGPD et juridique (mentions légales, CGU)
- ✅ Déployer une application mobile (APK Android via PWA)

### Public cible

Passionnés de musique live, 18-45 ans, recherchant une expérience premium avec paiement sécurisé et recommandations personnalisées.

---

##  Stack Technique

### Frontend

- **React 18** - Framework UI moderne
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **TailwindCSS** - Styling utility-first
- **Shadcn/UI** - Composants accessibles
- **TanStack Query** - Data fetching & caching
- **TanStack Router** - Routing type-safe
- **Zustand** - State management léger
- **React Hook Form + Zod** - Validation de formulaires
- **Stripe.js** - Paiements sécurisés
- **Capacitor.js** - PWA → APK Android

### Backend

- **Golang 1.23** - Langage performant et typé
- **Gorilla Mux** - Router HTTP
- **PostgreSQL 16** - Base de données relationnelle
- **JWT** - Authentification stateless
- **bcrypt** - Hashage de mots de passe
- **Stripe SDK** - Intégration paiements
- **OpenAI API** - Recherche IA (GPT-4)
- **SendGrid** - Emails transactionnels
- **MinIO** - Stockage S3-compatible

### Infrastructure & DevOps

- **Docker** - Conteneurisation
- **GitHub Actions** - CI/CD automatique
- **Vercel** - Hébergement frontend (CDN)
- **Render** - Hébergement backend (Docker)
- **Neon** - PostgreSQL serverless
- **Sentry** - Monitoring d'erreurs
- **Netlify** - Alternative CDN

---

## 📸 Aperçu

> Les maquettes wireframes sont disponibles dans `/frontend/docs/WIREFRAMES.md`  
> Le MCD (schéma de base de données) est disponible dans `/backend/docs/MCD.md`

### Captures d'écran principales

- **Page d'accueil** : Podium 3D des top artistes + défilement animé
- **Liste concerts** : Filtres avancés + recherche IA
- **Détail artiste** : Bio + widget Deezer (échantillons audio)
- **Checkout Stripe** : Formulaire sécurisé avec PaymentElement
- **Dashboard Admin** : CRUD artistes/concerts + analytics
- **Application mobile** : APK Android installable (PWA)

---

##  Installation

### Prérequis

- **Node.js** ≥ 20
- **Go** ≥ 1.23
- **Docker** & Docker Compose
- **PostgreSQL** 16 (ou compte Neon)
- **Compte Stripe** (mode test)
- **Compte OpenAI** (API key)
- **Git**

### Étapes

```bash
# Cloner le repository
git clone https://github.com/groupietracker/groupietracker.git
cd groupietracker

# Installer le frontend
cd frontend
npm install

# Installer le backend
cd ../backend
go mod download
```

---

## ⚙️ Configuration

### Frontend

Créer un fichier `.env` dans `/frontend` :

```env
VITE_API_URL=http://localhost:8080/api
VITE_STRIPE_PUBLIC_KEY=pk_test_51SzCo4DYWmJZvpp7jVA4uYYel0F1PBSQcNGkN0vMp7nn91e6p9qr8rqhwHNJ5msBznK7gEjVQfD7Nz20eb8dvzQL00uQgFUq9B
VITE_SENTRY_DSN=https://xxx@oYYY.ingest.sentry.io/ZZZ
VITE_GOOGLE_CLIENT_ID=123456-abcdef.apps.googleusercontent.com
```

### Backend

Créer un fichier `.env` dans `/backend` :

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/groupietracker?sslmode=require

# Auth
JWT_SECRET=your-super-secret-jwt-key-256-bits
GOOGLE_CLIENT_ID=123456-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# IA
OPENAI_API_KEY=sk-proj-xxx

# Email
SENDGRID_API_KEY=SG.xxx

# Storage S3
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/yyy

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Migrations de la base de données

```bash
cd backend
./scripts/migrate.sh up
```

---

## 💻 Utilisation

### Démarrage en développement

```bash
# Terminal 1 : Backend
cd backend
go run main.go
# API disponible sur http://localhost:8080

# Terminal 2 : Frontend
cd frontend
npm run dev
# Frontend disponible sur http://localhost:5173
```

### Build de production

```bash
# Frontend
cd frontend
npm run build
# Fichiers générés dans /dist

# Backend
cd backend
go build -o api main.go
# Binaire généré : ./api
```

### Générer l'APK Android

```bash
cd frontend
npm run build
npx cap sync android
cd android
./gradlew assembleRelease
# APK généré dans android/app/build/outputs/apk/release/
```

---

##  Fonctionnalités

###  Utilisateur

-  **Inscription / Connexion**
  - Email + mot de passe (hashé bcrypt)
  - OAuth Google (OpenID Connect)
  - Vérification email anti-bot
  - Réinitialisation mot de passe

-  **Concerts & Artistes**
  - Visualisation par artiste avec bio & membres
  - Lecteur Deezer intégré (échantillons audio)
  - Filtres avancés (date, ville, prix)
  - **Recherche IA** (OpenAI GPT-4) : "Trouve-moi un concert rap à Paris"

-  **Réservations**
  - Choix Standard / VIP
  - **Paiement sécurisé Stripe** (PCI-DSS niveau 1)
  - Confirmation email avec QR code
  - Historique des billets dans le profil

-  **Application Mobile**
  - PWA installable (manifest.json + service worker)
  - **APK Android** fonctionnel (Capacitor.js)
  - Mode offline (cache API)
  - Push notifications

###  Administrateur

-  **CRUD Artistes** (Create, Read, Update, Delete)
-  **CRUD Concerts**
-  **Dashboard Analytics** (stats temps réel)
-  **Gestion des paiements** (Stripe + réservations)
- **Gestion des utilisateurs**
-  **Logs d'activité** (activity_logs table)
-  **Upload d'images** (MinIO S3)

###  Sécurité & Conformité

- ✅ **JWT** avec expiration 24h
- ✅ **Mots de passe** hashés (bcrypt coût 14)
- ✅ **Rate limiting** : 5 req/s (burst 10)
- ✅ **HTTPS/TLS 1.3** en production
- ✅ **Security headers** (CSP, XSS Protection, etc.)
- ✅ **RGPD complet** : Mentions légales, CGU, Politique de confidentialité
- ✅ **Stripe Webhooks** : Vérification signature

---

##  Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR                              │
└───────────────┬─────────────────────────────────────────────┘
                │
        ┌───────▼────────┐
        │   FRONTEND     │
        │   React.js     │ ← Vercel CDN
        │   Vite + TS    │
        └───────┬────────┘
                │ HTTPS
        ┌───────▼────────┐
        │  BACKEND API   │
        │   Golang       │ ← Render (Docker)
        │   Gorilla Mux  │
        └───┬────┬───┬───┘
            │    │   │
    ┌───────▼┐ ┌─▼───▼───┐ ┌──────────┐
    │  Neon  │ │ Stripe  │ │  OpenAI  │
    │  PgSQL │ │ Payment │ │  GPT-4   │
    └────────┘ └─────────┘ └──────────┘
```

### Structure des dossiers

```
groupietracker/
├── .github/
│   └── workflows/
│       └── deploy.yml        # CI/CD Pipeline
├── backend/
│   ├── database/
│   │   └── migrations/       # Migrations SQL
│   ├── docs/
│   │   ├── MCD.md           # Schéma BDD
│   │   └── swagger.json     # API Documentation
│   ├── handlers/            # Routes HTTP
│   ├── middleware/          # Auth, CORS, etc.
│   ├── models/              # Structs Go
│   ├── services/            # Business logic
│   ├── storage/             # MinIO S3
│   ├── main.go              # Point d'entrée
│   ├── Dockerfile           # Image Docker
│   └── go.mod
├── frontend/
│   ├── android/             # Capacitor Android
│   ├── docs/
│   │   └── WIREFRAMES.md    # Maquettes
│   ├── public/              # Assets statiques
│   ├── src/
│   │   ├── components/      # Composants UI
│   │   ├── lib/             # API, config, Sentry
│   │   ├── pages/           # Pages/Routes
│   │   ├── stores/          # Zustand stores
│   │   └── main.tsx         # Point d'entrée
│   ├── capacitor.config.json
│   ├── package.json
│   └── vite.config.ts
├── docs/
│   └── VEILLE_TECH.md       # Board de veille
├── CHECKLIST.md             # Validation attendus
├── README.md                # Ce fichier
└── STRIPE_FIX.md            # Guide debug Stripe
```

---

##  Tests

### Tests couverts

- ✅ **Tests unitaires** (Go : `go test ./...`)
- ✅ **Tests d'intégration** (API endpoints)
- ✅ **Lint & Type-check** (ESLint, TypeScript, go vet)
- ⏳ **Tests E2E** (Cypress - optionnel)

### Commandes

```bash
# Backend
cd backend
go vet ./...          # Static analysis
go test ./... -v      # Unit tests
go test -race ./...   # Race conditions

# Frontend
cd frontend
npm run lint          # ESLint
npm run type-check    # TypeScript
npm test              # Jest (si configuré)
```

### Qualité du code

- **Lighthouse Score** : Objectif > 90 (Performance, Accessibility, SEO)
- **Sentry Monitoring** : Erreurs trackées en production
- **Code Coverage** : Objectif > 70%

---

##  Déploiement

### Environnements

| Environnement | Frontend | Backend | Base de données |
|--------------|----------|---------|-----------------|
| **Production** | Vercel | Render (Docker) | Neon PostgreSQL |
| **Staging** | Netlify | Render (test) | Neon (staging) |
| **Local** | localhost:5173 | localhost:8080 | localhost:5432 |

### CI/CD Automatique (GitHub Actions)

**Pipeline** :
1.  Lint & Tests (Frontend + Backend)
2.  Build & Push Docker Image (Docker Hub)
3.  Run Migrations (Neon PostgreSQL)
4.  Deploy Backend → Render
5.  Deploy Frontend → Vercel
6.  Upload Source Maps → Sentry
7.  Notification Discord

**Déclencheur** : Push sur branche `main`

### Déploiement manuel

```bash
# Frontend (Vercel)
cd frontend
npm run build
vercel --prod

# Backend (Render)
docker build -t groupietracker/backend:latest ./backend
docker push groupietracker/backend:latest
# Puis redéployer sur Render Dashboard
```

### Variables d'environnement (Production)

#### Vercel (Frontend)
```
VITE_API_URL=https://votre-backend.onrender.com/api
VITE_STRIPE_PUBLIC_KEY=pk_test_xxx
VITE_SENTRY_DSN=https://xxx@sentry.io/yyy
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

#### Render (Backend)
```
DATABASE_URL=postgresql://xxx@neon.tech/groupietracker
STRIPE_SECRET_KEY=sk_test_xxx
JWT_SECRET=xxx
OPENAI_API_KEY=sk-proj-xxx
SENDGRID_API_KEY=SG.xxx
ALLOWED_ORIGINS=https://votre-frontend.vercel.app
```

---

##  Conformité RGPD

### Documents juridiques

- ✅ **Mentions Légales** (`/frontend/src/pages/MentionsLegales.tsx`)
- ✅ **Politique de Confidentialité** (`/frontend/src/pages/PolitiqueConfidentialite.tsx`)
- ✅ **CGU** (Conditions Générales d'Utilisation) (`/frontend/src/pages/CGU.tsx`)

### Droits des utilisateurs (RGPD Art. 15-22)

- **Droit d'accès** : Copie des données personnelles
- **Droit de rectification** : Correction des erreurs
- **Droit à l'effacement** : Suppression du compte
- **Droit à la portabilité** : Export CSV/JSON
- **Droit d'opposition** : Refus d'un traitement

**Contact DPO** : dpo@groupietracker.fr

### Sécurité des données

- Chiffrement HTTPS/TLS 1.3
- Mots de passe hashés (bcrypt)
- Données bancaires JAMAIS stockées (Stripe PCI-DSS)
- Logs anonymisés après 90 jours
- Backups chiffrés (Neon)

---

##  Équipe

| Nom | Rôle | Contact |
|-----|------|---------|
| **Arthur** | Tech Lead / Fullstack | arthur@groupietracker.fr |
| **Consultant** | gganster (Discord) | Ynov - Support technique |

---

##  Licence

Ce projet est sous licence **MIT**. Voir [LICENSE](LICENSE) pour plus de détails.

---

##  Liens Utiles

-  **Production** : [https://groupietracker.vercel.app](https://groupietracker.vercel.app)
-  **API Backend** : [https://groupietracker-api.onrender.com](https://groupietracker-api.onrender.com)
-  **Sentry Monitoring** : [https://sentry.io/groupietracker](https://sentry.io/groupietracker)
-  **Stripe Dashboard** : [https://dashboard.stripe.com](https://dashboard.stripe.com)
-  **Docker Hub** : [https://hub.docker.com/r/groupietracker](https://hub.docker.com/r/groupietracker)

---

**© 2025 Groupie Tracker - Tous droits réservés**
