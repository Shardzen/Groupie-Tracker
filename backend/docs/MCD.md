# Modèle Conceptuel de Données (MCD) - Groupie Tracker Advanced

## 🗂️ Schéma de la Base de Données

```
┌─────────────────────────────────────────────────────────────────┐
│                       GROUPIE TRACKER DATABASE                   │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│      USERS           │         │      ARTISTS         │
├──────────────────────┤         ├──────────────────────┤
│ PK id (SERIAL)       │         │ PK id (SERIAL)       │
│    email (TEXT)      │         │    name (TEXT)       │
│    password_hash     │         │    image (TEXT)      │
│    name (TEXT)       │         │    bio (TEXT)        │
│    role (TEXT)       │         │    members (TEXT[])  │
│    oauth_provider    │         │    creation_date     │
│    oauth_id          │         │    first_album       │
│    email_verified    │         │    locations (TEXT[])│
│    verification_token│         │    concert_dates     │
│    reset_token       │         │    relations (JSONB) │
│    reset_expires     │         │    created_at        │
│    created_at        │         └──────────────────────┘
└──────────────────────┘                    │
         │                                  │
         │ 1                            N   │
         │                                  │
         │           ┌──────────────────────┴──────┐
         │           │      CONCERTS               │
         │           ├─────────────────────────────┤
         │           │ PK id (SERIAL)              │
         │           │ FK artist_id → ARTISTS      │
         │           │    name (TEXT)              │
         │           │    location (TEXT)          │
         │           │    city (TEXT)              │
         │           │    venue (TEXT)             │
         │           │    date (TIMESTAMP)         │
         │           │    image_url (TEXT)         │
         │           │    price (DECIMAL)          │
         │           │    standard_price (DECIMAL) │
         │           │    vip_price (DECIMAL)      │
         │           │    available_tickets (INT)  │
         │           │    available_standard (INT) │
         │           │    available_vip (INT)      │
         │           │    created_at               │
         │           └─────────────────────────────┘
         │                         │
         │ 1                     N │
         │                         │
         └─────────┬───────────────┘
                   │
                   │
         ┌─────────▼──────────────────────────┐
         │      RESERVATIONS                  │
         ├────────────────────────────────────┤
         │ PK id (SERIAL)                     │
         │ FK user_id → USERS                 │
         │ FK concert_id → CONCERTS           │
         │    ticket_type (TEXT)              │
         │    quantity (INT)                  │
         │    total_price (DECIMAL)           │
         │    status (TEXT)                   │
         │    payment_status (TEXT)           │
         │    payment_intent (TEXT)           │
         │    stripe_payment_intent_id (TEXT) │
         │    stripe_payment_status (TEXT)    │
         │    expires_at (TIMESTAMP)          │
         │    created_at (TIMESTAMP)          │
         │    updated_at (TIMESTAMP)          │
         └────────────────────────────────────┘
                   │
                   │
         ┌─────────▼──────────────────────────┐
         │      ACTIVITY_LOGS                 │
         ├────────────────────────────────────┤
         │ PK id (SERIAL)                     │
         │ FK user_id → USERS (nullable)      │
         │    action (TEXT)                   │
         │    resource (TEXT)                 │
         │    resource_id (INT)               │
         │    details (JSONB)                 │
         │    ip_address (TEXT)               │
         │    user_agent (TEXT)               │
         │    created_at (TIMESTAMP)          │
         └────────────────────────────────────┘
```

## 📊 Relations et Cardinalités

### 🔗 USERS ↔ RESERVATIONS
- **Type**: One-to-Many (1:N)
- **Description**: Un utilisateur peut avoir plusieurs réservations
- **Clé étrangère**: `reservations.user_id` → `users.id`
- **Contrainte**: `ON DELETE CASCADE`

### 🔗 ARTISTS ↔ CONCERTS
- **Type**: One-to-Many (1:N)
- **Description**: Un artiste peut avoir plusieurs concerts
- **Clé étrangère**: `concerts.artist_id` → `artists.id`
- **Contrainte**: `ON DELETE CASCADE`

### 🔗 CONCERTS ↔ RESERVATIONS
- **Type**: One-to-Many (1:N)
- **Description**: Un concert peut avoir plusieurs réservations
- **Clé étrangère**: `reservations.concert_id` → `concerts.id`
- **Contrainte**: `ON DELETE CASCADE`

### 🔗 USERS ↔ ACTIVITY_LOGS
- **Type**: One-to-Many (1:N)
- **Description**: Un utilisateur génère plusieurs logs d'activité
- **Clé étrangère**: `activity_logs.user_id` → `users.id`
- **Contrainte**: `ON DELETE SET NULL` (logs anonymisés)

---

## 🔐 Index et Contraintes

### Index principaux
```sql
-- Performance queries
CREATE INDEX idx_concerts_artist_id ON concerts(artist_id);
CREATE INDEX idx_concerts_date ON concerts(date);
CREATE INDEX idx_reservations_user_id ON reservations(user_id);
CREATE INDEX idx_reservations_concert_id ON reservations(concert_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_expires_at ON reservations(expires_at);

-- Auth & Security
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_token);

-- Analytics
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

### Contraintes de validation
```sql
-- Users
ALTER TABLE users ADD CONSTRAINT chk_role CHECK (role IN ('user', 'admin'));
ALTER TABLE users ADD CONSTRAINT chk_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$');

-- Reservations
ALTER TABLE reservations ADD CONSTRAINT chk_ticket_type CHECK (ticket_type IN ('standard', 'vip'));
ALTER TABLE reservations ADD CONSTRAINT chk_quantity CHECK (quantity > 0);
ALTER TABLE reservations ADD CONSTRAINT chk_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'expired'));
ALTER TABLE reservations ADD CONSTRAINT chk_payment_status CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'refunded'));

-- Concerts
ALTER TABLE concerts ADD CONSTRAINT chk_price CHECK (price >= 0);
ALTER TABLE concerts ADD CONSTRAINT chk_available_tickets CHECK (available_tickets >= 0);
```

---

## 📈 Diagramme Entité-Association (Notation Chen)

```
       ┌───────────┐
       │   USERS   │
       └─────┬─────┘
             │
             │ possède
             │ (1,N)
             │
       ┌─────▼──────────┐
       │  RESERVATIONS  │
       └─────┬──────────┘
             │
             │ concerne
             │ (N,1)
             │
       ┌─────▼─────┐         présente        ┌──────────┐
       │ CONCERTS  │◄────────(1,N)───────────┤ ARTISTS  │
       └───────────┘                          └──────────┘
```

---

## 🛡️ Sécurité et RGPD

### Données sensibles
- `users.password_hash`: Hashé avec bcrypt (coût 14)
- `users.email`: Chiffré au repos (AES-256)
- `users.reset_token`: Token JWT temporaire (expire 1h)
- `users.verification_token`: UUID v4 (expire 24h)

### Anonymisation
- Les logs d'activité sont anonymisés si l'utilisateur supprime son compte
- Les paiements Stripe sont stockés hors BDD (PCI-DSS compliance)

### Durée de rétention
- **Reservations expirées**: Supprimées automatiquement après 30 jours
- **Activity logs**: Conservés 90 jours (RGPD Art. 6)
- **Comptes inactifs**: Notification après 2 ans, suppression après 3 ans

---

## 🔄 Migrations

Les migrations sont gérées automatiquement via:
- `backend/database/migrations/` (fichiers SQL numérotés)
- Déploiement automatique via CI/CD (Azure ACI)

Commandes:
```bash
# Appliquer les migrations
cd backend && ./scripts/migrate.sh up

# Rollback
cd backend && ./scripts/migrate.sh down
```

---

## 📊 Statistiques et Analytics

### Vues matérialisées (performances)
```sql
-- Top artistes par ventes
CREATE MATERIALIZED VIEW mv_top_artists AS
SELECT 
    a.id, 
    a.name, 
    COUNT(r.id) as total_reservations,
    SUM(r.total_price) as total_revenue
FROM artists a
JOIN concerts c ON c.artist_id = a.id
JOIN reservations r ON r.concert_id = c.id
WHERE r.status = 'confirmed'
GROUP BY a.id, a.name
ORDER BY total_revenue DESC;

-- Rafraîchissement toutes les heures (cron job)
REFRESH MATERIALIZED VIEW mv_top_artists;
```

---

## 🗃️ Backup et Recovery

- **Backups automatiques**: Tous les jours à 3h00 UTC (Neon)
- **Point-in-time recovery**: 30 jours
- **Réplication**: Multi-region (EU-West)

---

**Dernière mise à jour**: 11 février 2025  
**Version**: 2.0  
**Auteur**: Groupie Tracker Team
