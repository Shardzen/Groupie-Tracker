# 🎸 Groupie Tracker Advanced - Documentation Complète

> **Plateforme de réservation de billets de concert avec paiement Stripe, recherche IA et OAuth**

[![CI/CD](https://github.com/groupietracker/groupietracker/actions/workflows/deploy.yml/badge.svg)](https://github.com/groupietracker/groupietracker/actions)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://groupietracker.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Go%201.23-00ADD8?logo=go)](https://groupietracker-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Table des matières

- [🎯 Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🚀 Installation Locale](#-installation-locale)
- [📦 Technologies](#-technologies)
- [🔐 Configuration Environnement](#-configuration-environnement)
- [🚢 Déploiement Production](#-déploiement-production)
- [📄 Documentation](#-documentation)
- [🧪 Tests](#-tests)
- [🔒 Sécurité & RGPD](#-sécurité--rgpd)
- [👥 Équipe](#-équipe)

---

## 🎯 Fonctionnalités

### 👤 Utilisateur

#### Authentification
- ✅ **Inscription** : Email + mot de passe (hashé bcrypt)
- ✅ **Connexion** : Email + mot de passe
- ✅ **OAuth Google** : Connexion rapide via Google
- ✅ **Vérification email** : Anti-bot (token unique)
- ✅ **Réinitialisation mot de passe** : Email de récupération
- ✅ **JWT sécurisé** : Expiration 24h

#### Concerts & Artistes
- ✅ **Liste des artistes** : Filtres (genre, nom)
- ✅ **Détails artiste** : Bio, membres, albums, concerts
- ✅ **Lecteur Deezer intégré** : Échantillons audio
- ✅ **Liste des concerts** : Filtres (date, ville, prix)
- ✅ **Recherche classique** : Barre de recherche
- ✅ **Recherche IA** : Moteur OpenAI GPT-4 (recommandations personnalisées)

#### Réservations & Paiement
- ✅ **Panier d'achat** : Ajout/suppression de billets
- ✅ **Types de billets** : Standard / VIP
- ✅ **Paiement Stripe** : CB sécurisée (PCI-DSS)
- ✅ **Confirmation email** : Billet PDF avec QR code
- ✅ **Historique** : Liste des réservations dans le profil

#### Mobile & PWA
- ✅ **PWA complète** : Installable sur mobile/desktop
- ✅ **APK Android** : Généré via Capacitor.js
- ✅ **Mode offline** : Service Worker + cache
- ✅ **Splash screen** : Icônes & branding

### 🛡️ Administrateur

- ✅ **CRUD Artistes** : Créer, modifier, supprimer
- ✅ **CRUD Concerts** : Gestion complète
- ✅ **Dashboard Analytics** : Statistiques en temps réel
- ✅ **Gestion paiements** : Visualisation Stripe + réservations
- ✅ **Gestion utilisateurs** : Liste, rôles, suppressions
- ✅ **Logs d'activité** : Traçabilité complète
- ✅ **Upload images** : MinIO S3-compatible

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEUR                              │
│              (Navigateur / Application Mobile)              │
└───────────────┬─────────────────────────────────────────────┘
                │
        ┌───────▼────────┐
        │   FRONTEND     │
        │   React 18     │ ← Vercel (CDN Global)
        │   TypeScript   │
        │   Vite + PWA   │
        └───────┬────────┘
                │ HTTPS/TLS 1.3
        ┌───────▼────────┐
        │  BACKEND API   │
        │   Golang 1.23  │ ← Render (Docker Container)
        │   Gorilla Mux  │
        │   JWT Auth     │
        └───┬────┬───┬───┘
            │    │   │
    ┌───────▼┐ ┌─▼───▼───┐ ┌──────────┐
    │  Neon  │ │ Stripe  │ │  OpenAI  │
    │  PgSQL │ │ Payment │ │  GPT-4   │
    │  (DB)  │ │   API   │ │   API    │
    └────────┘ └─────────┘ └──────────┘
         │
    ┌────▼────┐
    │  MinIO  │
    │  (S3)   │
    └─────────┘
```

### Stack Technique Détaillée

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Shadcn/UI |
| **State Management** | Zustand, TanStack Query (React Query) |
| **Forms & Validation** | React Hook Form + Zod |
| **Routing** | TanStack Router (file-based) |
| **Backend** | Golang 1.23, Gorilla Mux |
| **Database** | PostgreSQL 16 (Neon Serverless) |
| **Auth** | JWT, Google OAuth 2.0, bcrypt (coût 14) |
| **Payment** | Stripe SDK (API v2024) |
| **Storage** | MinIO (S3-compatible) |
| **IA** | OpenAI GPT-4 Turbo |
| **Music** | Deezer API (widgets) |
| **Monitoring** | Sentry.io (source maps activées) |
| **Email** | SendGrid |
| **Hosting Frontend** | Vercel (Edge Network) |
| **Hosting Backend** | Render (Docker ACI) |
| **CI/CD** | GitHub Actions |
| **Mobile** | Capacitor.js (PWA → APK Android) |

---

## 🚀 Installation Locale

### Prérequis

- Node.js 20+
- Go 1.23+
- PostgreSQL 16
- Docker (optionnel)
- Compte Stripe (mode test)
- Compte OpenAI (API key)

### 1️⃣ Clone le repository

```bash
git clone https://github.com/votre-username/groupie-tracker.git
cd groupie-tracker
```

### 2️⃣ Setup Backend

```bash
cd backend

# Installer les dépendances Go
go mod download

# Créer le fichier .env
cp .env.example .env
nano .env  # Éditer avec vos clés (voir section Configuration)

# Lancer les migrations
./scripts/migrate.sh up

# Démarrer le serveur
go run main.go
```

**API disponible sur** : `http://localhost:8080`

### 3️⃣ Setup Frontend

```bash
cd frontend

# Installer les dépendances npm
npm install

# Créer le fichier .env
cp .env.example .env
nano .env  # Éditer avec vos clés

# Démarrer le serveur de développement
npm run dev
```

**Frontend disponible sur** : `http://localhost:5173`

### 4️⃣ Setup Base de Données Locale (Optionnel)

Si vous n'utilisez pas Neon :

```bash
# Via Docker
docker run --name groupietracker-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=groupietracker \
  -p 5432:5432 \
  -d postgres:16

# Ou via PostgreSQL local
psql -U postgres
CREATE DATABASE groupietracker;
```

Puis dans `.env` :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/groupietracker?sslmode=disable
```

---

## 📦 Technologies

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.17.0",
    "@tanstack/router": "^1.14.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.49.3",
    "zod": "^3.22.4",
    "tailwindcss": "^3.4.1",
    "@stripe/stripe-js": "^2.4.0",
    "@stripe/react-stripe-js": "^2.4.0",
    "@sentry/react": "^7.99.0",
    "@capacitor/core": "^5.7.0",
    "@capacitor/android": "^5.7.0",
    "lucide-react": "^0.263.1",
    "chart.js": "^4.4.1",
    "react-chartjs-2": "^5.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^7.3.1",
    "vite-plugin-pwa": "^0.20.0",
    "typescript": "^5.3.3"
  }
}
```

### Backend Dependencies

```go
module groupie-backend

require (
    github.com/gorilla/mux v1.8.1
    github.com/lib/pq v1.10.9
    github.com/stripe/stripe-go/v76 v76.14.0
    github.com/golang-jwt/jwt/v5 v5.2.0
    golang.org/x/crypto v0.18.0
    github.com/joho/godotenv v1.5.1
    github.com/rs/cors v1.10.1
    github.com/minio/minio-go/v7 v7.0.66
    golang.org/x/time v0.5.0
)
```

---

## 🔐 Configuration Environnement

### ⚠️ IMPORTANT

**NE JAMAIS** commiter les fichiers `.env` dans Git !  
Ils sont dans `.gitignore` pour votre sécurité.

### Frontend : `frontend/.env`

```env
# URL de l'API backend
VITE_API_URL=http://localhost:8080/api

# Clé publique Stripe (commence par pk_test_ en dev)
VITE_STRIPE_PUBLIC_KEY=pk_test_VOTRE_CLE_PUBLIQUE

# Sentry DSN (monitoring erreurs)
VITE_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
```

### Backend : `backend/.env`

```env
# ===== DATABASE =====
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# ===== STRIPE =====
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET

# ===== AUTH =====
JWT_SECRET=votre-secret-jwt-256-bits-tres-aleatoire

# ===== OAUTH GOOGLE =====
GOOGLE_CLIENT_ID=123456-abc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-votre-secret
GOOGLE_REDIRECT_URL=http://localhost:8080/api/auth/google/callback

# ===== EMAIL =====
SENDGRID_API_KEY=SG.votre-cle-sendgrid
FROM_EMAIL=noreply@groupietracker.fr

# ===== IA =====
OPENAI_API_KEY=sk-proj-votre-cle-openai

# ===== STORAGE S3 (MinIO) =====
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET=groupietracker

# ===== MONITORING =====
SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz

# ===== CORS =====
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# ===== SERVER =====
PORT=8080
```

### 🔑 Où obtenir les clés ?

| Service | Où trouver |
|---------|-----------|
| **Stripe** | [Dashboard Stripe](https://dashboard.stripe.com) → Developers → API Keys |
| **Google OAuth** | [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials |
| **OpenAI** | [OpenAI Platform](https://platform.openai.com) → API Keys |
| **SendGrid** | [SendGrid Dashboard](https://app.sendgrid.com) → Settings → API Keys |
| **Sentry** | [Sentry.io](https://sentry.io) → Settings → Projects → Client Keys (DSN) |
| **Neon** | [Neon Dashboard](https://console.neon.tech) → Connection String |

---

## 🚢 Déploiement Production

### Frontend sur Vercel

1. **Connecter le repo GitHub à Vercel**
   - Dashboard Vercel → New Project → Import Git Repository

2. **Configurer les variables d'environnement**
   - Settings → Environment Variables → Ajouter :
     ```
     VITE_API_URL=https://votre-backend.onrender.com/api
     VITE_STRIPE_PUBLIC_KEY=pk_test_...
     VITE_SENTRY_DSN=https://...
     VITE_GOOGLE_CLIENT_ID=...
     ```

3. **Build Settings** (détecté automatiquement par Vercel)
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Déployer**
   - Push sur `main` → Déploiement automatique

### Backend sur Render

1. **Créer un Web Service**
   - Dashboard Render → New → Web Service
   - Connecter le repo GitHub
   - Branch: `main`

2. **Configuration**
   - Name: `groupietracker-api`
   - Runtime: Docker
   - Dockerfile Path: `backend/Dockerfile`
   - Region: Frankfurt (EU)

3. **Variables d'environnement**
   - Environment → Add Environment Variables
   - Copier toutes les variables du backend (voir section Configuration)
   - **IMPORTANT** : `ALLOWED_ORIGINS` doit contenir l'URL Vercel

4. **Scaling**
   - Instance Type: Starter (gratuit pour débuter)
   - Auto-Deploy: Activé

### Base de Données sur Neon

1. **Créer un projet**
   - [Neon Dashboard](https://console.neon.tech) → New Project
   - Region: Europe (EU-West)
   - PostgreSQL Version: 16

2. **Récupérer la Connection String**
   - Dashboard → Connection Details
   - Copier `DATABASE_URL`

3. **Migrations**
   - Exécutées automatiquement via GitHub Actions
   - Ou manuellement : `./scripts/migrate.sh up`

### CI/CD avec GitHub Actions

Le fichier `.github/workflows/deploy.yml` automatise :

1. ✅ Tests frontend & backend
2. 🐳 Build Docker image
3. 📤 Push sur Docker Hub
4. 🗄️ Migrations automatiques
5. ☁️ Déploiement Azure/Render
6. 🌐 Déploiement Netlify/Vercel
7. 📊 Upload source maps Sentry

**Secrets GitHub requis** (Settings → Secrets) :
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- `SENDGRID_API_KEY`
- `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`
- `NETLIFY_AUTH_TOKEN`, `NETLIFY_SITE_ID`

---

## 📄 Documentation

| Document | Description | Lien |
|----------|-------------|------|
| **Swagger API** | Documentation OpenAPI 2.0 complète | [swagger.json](./backend/docs/swagger.json) |
| **MCD** | Modèle Conceptuel de Données | [MCD.md](./backend/docs/MCD.md) |
| **Wireframes** | Zoning de toutes les pages | [WIREFRAMES.md](./frontend/docs/WIREFRAMES.md) |
| **Veille Tech** | Sources et planning de veille | [VEILLE_TECH.md](./docs/VEILLE_TECH.md) |
| **Mentions Légales** | Page juridique RGPD | [MentionsLegales.tsx](./frontend/src/pages/MentionsLegales.tsx) |
| **CGU** | Conditions Générales d'Utilisation | [CGU.tsx](./frontend/src/pages/CGU.tsx) |
| **Politique Confidentialité** | Politique RGPD complète | [PolitiqueConfidentialite.tsx](./frontend/src/pages/PolitiqueConfidentialite.tsx) |
| **Checklist** | Validation des attendus | [CHECKLIST.md](./CHECKLIST.md) |

---

## 🧪 Tests

### Frontend

```bash
cd frontend

# Lint (ESLint)
npm run lint

# Type checking (TypeScript)
npx tsc --noEmit

# Build test
npm run build

# Tests unitaires (si configuré)
npm test
```

### Backend

```bash
cd backend

# Analyse statique
go vet ./...

# Tests unitaires
go test ./... -v

# Tests avec couverture
go test ./... -cover

# Tests race conditions
go test -race ./...

# Build test
go build -o api main.go
```

### Tests E2E (Cypress)

```bash
cd frontend
npm run test:e2e
```

---

## 🔒 Sécurité & RGPD

### Mesures de Sécurité

#### Authentification
- ✅ **JWT** avec expiration 24h
- ✅ **Mots de passe** hashés bcrypt (coût 14)
- ✅ **Rate limiting** : 5 req/s (burst 10)
- ✅ **Google OAuth** : OpenID Connect

#### Transport
- ✅ **HTTPS/TLS 1.3** obligatoire en production
- ✅ **CORS** : Whitelist stricte des origines
- ✅ **CSP** : Content Security Policy configurée

#### Headers de Sécurité

```go
Content-Security-Policy: default-src 'self'; ...
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000
```

#### Backend
- ✅ **Prepared statements** (protection SQL injection)
- ✅ **Input validation** (Zod côté frontend, validation Go backend)
- ✅ **Secrets** : Variables d'environnement uniquement
- ✅ **Stripe Webhooks** : Signature validation

### Conformité RGPD

#### Droits des utilisateurs
- ✅ **Art. 15** : Droit d'accès
- ✅ **Art. 16** : Droit de rectification
- ✅ **Art. 17** : Droit à l'effacement
- ✅ **Art. 18** : Droit à la limitation
- ✅ **Art. 20** : Droit à la portabilité
- ✅ **Art. 21** : Droit d'opposition

#### Mesures techniques
- ✅ **Chiffrement** : TLS 1.3, mots de passe hashés
- ✅ **Anonymisation** : Logs après 90 jours
- ✅ **Durée de rétention** : 3 ans max (comptes inactifs)
- ✅ **Consentement** : Cookie banner conforme
- ✅ **DPO** : dpo@groupietracker.fr
- ✅ **Transferts hors UE** : CCT avec Stripe, OpenAI

---

## 📱 Générer l'APK Android

```bash
cd frontend

# Build production
npm run build

# Sync Capacitor
npx cap sync android

# Ouvrir Android Studio
npx cap open android

# Ou build via CLI
cd android
./gradlew assembleRelease

# APK généré dans :
# android/app/build/outputs/apk/release/app-release.apk
```

**Installation** :
```bash
adb install app-release.apk
```

---

## 👥 Équipe

| Nom | Rôle | Responsabilités |
|-----|------|-----------------|
| **Arthur** | Développeur Fullstack | Frontend React, Backend Go, Déploiement |

**Consultant** : gganster (Discord)

---

## 🔗 Liens Utiles

- 🌐 **Production Frontend** : [https://groupietracker.vercel.app](https://groupietracker.vercel.app)
- 🔧 **Production Backend** : [https://groupietracker-api.onrender.com](https://groupietracker-api.onrender.com)
- 📊 **Sentry** : [Dashboard Monitoring](https://sentry.io/organizations/groupietracker)
- 💳 **Stripe Dashboard** : [Paiements Test](https://dashboard.stripe.com/test/dashboard)
- 🗄️ **Neon Database** : [Console PostgreSQL](https://console.neon.tech)
- 📧 **SendGrid** : [Email Analytics](https://app.sendgrid.com)

---

## 📜 Licence

Ce projet est sous licence **MIT**.

---

**© 2025 Groupie Tracker - Tous droits réservés**
