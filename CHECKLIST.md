# ✅ CHECKLIST AVANT DÉMARRAGE

## 📋 Liste de vérification complète

Coche chaque case avant de démarrer le projet pour éviter les problèmes.

---

## 🔧 1. INSTALLATIONS

- [ ] **Go 1.24+** installé
  ```bash
  go version
  # Doit afficher : go version go1.24.0 ou supérieur
  ```

- [ ] **Node.js 18+** installé
  ```bash
  node --version
  # Doit afficher : v18.x.x ou supérieur
  ```

- [ ] **npm 9+** installé
  ```bash
  npm --version
  # Doit afficher : 9.x.x ou supérieur
  ```

- [ ] **Git** installé (optionnel, pour les mises à jour)
  ```bash
  git --version
  ```

---

## 📁 2. FICHIERS DE CONFIGURATION

### Backend

- [ ] Le fichier `backend/.env` existe
- [ ] Le fichier s'appelle bien `.env` (pas `.env.txt`)
- [ ] `DATABASE_URL` est rempli :
  ```
  DATABASE_URL=postgres://postgres:Brutus.mp4@ynot.c3uigikwaezf.eu-north-1.rds.amazonaws.com:5432/ynot_db?sslmode=require
  ```
- [ ] `JWT_SECRET` est rempli
- [ ] `STRIPE_SECRET_KEY` est rempli
- [ ] `STRIPE_WEBHOOK_SECRET` est rempli
- [ ] `SMTP_HOST` et `SMTP_PASSWORD` sont remplis (pour l'envoi d'emails)
- [ ] `MINIO_*` (AWS S3) sont remplis

### Frontend

- [ ] Le fichier `frontend/.env` existe
- [ ] `VITE_API_URL` est défini :
  ```
  VITE_API_URL=http://localhost:8080/api
  ```
- [ ] `VITE_STRIPE_PUBLIC_KEY` est défini

---

## 🌐 3. CONNECTIVITÉ

- [ ] **Connexion internet** active (pour se connecter à AWS RDS)
- [ ] **Pare-feu** autorise les connexions sur :
  - Port `8080` (backend)
  - Port `5173` (frontend)
- [ ] **Antivirus** n'interfère pas avec les serveurs locaux

### Tester la connexion à la base de données

```bash
# Windows (PowerShell)
Test-NetConnection -ComputerName ynot.c3uigikwaezf.eu-north-1.rds.amazonaws.com -Port 5432

# Linux/Mac
nc -zv ynot.c3uigikwaezf.eu-north-1.rds.amazonaws.com 5432
```

**Résultat attendu :** `TcpTestSucceeded : True` ou `succeeded!`

---

## 🗂️ 4. STRUCTURE DU PROJET

Vérifier que tous les dossiers/fichiers principaux existent :

```
Groupie-Tracker/
├── backend/
│   ├── .env                    ← CRITIQUE
│   ├── main.go
│   ├── go.mod
│   ├── go.sum
│   ├── database/
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   └── services/
│
├── frontend/
│   ├── .env                    ← CRITIQUE
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.ts
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── components/
│   │   ├── pages/
│   │   └── stores/
│   └── public/
│
├── START.bat                   ← Script de démarrage Windows
├── START.md                    ← Guide de démarrage
└── TROUBLESHOOTING.md          ← Guide de dépannage
```

---

## 🔌 5. PORTS DISPONIBLES

Vérifier qu'aucun autre processus n'utilise ces ports :

- [ ] **Port 8080** libre (backend)
  ```bash
  # Windows
  netstat -ano | findstr :8080
  # Si rien n'apparaît, le port est libre ✅

  # Linux/Mac
  lsof -i :8080
  # Si rien n'apparaît, le port est libre ✅
  ```

- [ ] **Port 5173** libre (frontend)
  ```bash
  # Windows
  netstat -ano | findstr :5173

  # Linux/Mac
  lsof -i :5173
  ```

---

## 📦 6. DÉPENDANCES

### Backend (Go modules)

- [ ] Télécharger les dépendances :
  ```bash
  cd backend
  go mod download
  ```

**Attendu :** Aucune erreur. Les packages sont téléchargés.

### Frontend (npm packages)

- [ ] Installer les dépendances :
  ```bash
  cd frontend
  npm install
  ```

**Attendu :** 
```
added XXX packages in XXs
```

---

## 🗄️ 7. BASE DE DONNÉES

- [ ] **Connexion établie**
  ```bash
  # Depuis le dossier backend
  go run . 
  # Chercher dans les logs : "✅ Database connection established successfully"
  ```

- [ ] **Tables créées**
  ```bash
  # Chercher dans les logs : "✅ Database tables created/verified successfully"
  ```

### Tables attendues :
- `users`
- `artists`
- `concerts`
- `reservations`
- `password_reset_tokens`
- `email_verification_tokens`
- `activity_logs`

---

## 🎨 8. ASSETS FRONTEND

- [ ] Les images des artistes existent dans `frontend/public/artists/`
- [ ] Le fichier `favicon.svg` existe
- [ ] Le fichier `manifest.json` existe

---

## 🔐 9. SÉCURITÉ

- [ ] Le fichier `.env` n'est **PAS** commité sur Git
  ```bash
  git status
  # .env ne doit PAS apparaître dans les fichiers à commiter
  ```

- [ ] Le fichier `.gitignore` contient :
  ```
  .env
  node_modules/
  dist/
  ```

---

## 🧪 10. TESTS DE BASE

### Test 1 : Backend Health Check

```bash
# Démarrer le backend
cd backend
go run .

# Dans un autre terminal ou navigateur
curl http://localhost:8080/api/health
```

**Résultat attendu :**
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-02-11T..."
}
```

### Test 2 : Frontend démarre

```bash
cd frontend
npm run dev
```

**Résultat attendu :**
```
  VITE v7.3.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Test 3 : Frontend se connecte au backend

1. Ouvrir http://localhost:5173 dans le navigateur
2. Ouvrir DevTools (F12) → Onglet Network
3. Naviguer vers `/artists`
4. Vérifier qu'une requête `GET http://localhost:8080/api/artists` apparaît
5. Status code doit être `200`

---

## 🎯 11. FONCTIONNALITÉS DE BASE

### Test inscription/connexion

- [ ] Page `/register` accessible
- [ ] Inscription fonctionne (vérifier les logs backend)
- [ ] Email de vérification envoyé (vérifier les logs)
- [ ] Page `/login` accessible
- [ ] Connexion fonctionne
- [ ] Token JWT stocké dans localStorage

### Test navigation

- [ ] Page `/` (home) s'affiche correctement
- [ ] Page `/artists` liste les artistes
- [ ] Page `/concerts` liste les concerts
- [ ] Page `/artist/:id` affiche les détails d'un artiste

### Test paiement (Stripe)

- [ ] Ajouter un billet au panier
- [ ] Accéder à `/checkout`
- [ ] Formulaire Stripe s'affiche
- [ ] Test avec carte `4242 4242 4242 4242` fonctionne

---

## 🎬 12. PRÊT À DÉMARRER

Si **toutes les cases sont cochées**, tu es prêt ! 🎉

### Démarrage rapide :

**Option 1 : Script automatique (Windows)**
```bash
# Double-cliquer sur START.bat
```

**Option 2 : Manuel**
```bash
# Terminal 1 - Backend
cd backend
go run .

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Accès :
- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:8080/api/health
- **Admin** : http://localhost:5173/admin (si compte admin)

---

## ⚠️ PROBLÈMES ?

Si quelque chose ne fonctionne pas, consulte :
- `TROUBLESHOOTING.md` pour les solutions aux erreurs courantes
- `START.md` pour le guide de démarrage détaillé

---

## 📞 RESSOURCES UTILES

- **Documentation Stripe** : https://stripe.com/docs
- **Documentation Go** : https://go.dev/doc/
- **Documentation Vite** : https://vitejs.dev/
- **PostgreSQL Docs** : https://www.postgresql.org/docs/

---

**Happy coding! 🚀**
