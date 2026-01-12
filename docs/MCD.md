# Modèle Conceptuel de Données (MCD) - Groupie Tracker

## Schéma Entité-Association

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BASE DE DONNÉES GROUPIE TRACKER                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│       USERS         │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│     email           │ VARCHAR(255) UNIQUE NOT NULL
│     password_hash   │ VARCHAR(255) (NULL si OAuth)
│     google_id       │ VARCHAR(255) UNIQUE (NULL si email/password)
│     first_name      │ VARCHAR(100)
│     last_name       │ VARCHAR(100)
│     is_admin        │ BOOLEAN DEFAULT false
│     is_verified     │ BOOLEAN DEFAULT false
│     verification_token │ VARCHAR(255)
│     reset_token     │ VARCHAR(255)
│     reset_token_expires │ TIMESTAMP
│     created_at      │ TIMESTAMP DEFAULT NOW()
│     updated_at      │ TIMESTAMP
└─────────────────────┘
          │
          │ 1
          │
          │ N
          ▼
┌─────────────────────┐
│     BOOKINGS        │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│ FK  user_id         │ INT NOT NULL
│ FK  concert_id      │ INT NOT NULL
│     quantity        │ INT NOT NULL
│     total_price     │ DECIMAL(10,2) NOT NULL
│     status          │ ENUM('pending', 'confirmed', 'cancelled')
│     booking_code    │ VARCHAR(50) UNIQUE
│     created_at      │ TIMESTAMP DEFAULT NOW()
└─────────────────────┘
          │
          │ N
          │
          │ 1
          ▼
┌─────────────────────┐
│     CONCERTS        │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│ FK  artist_id       │ INT NOT NULL
│     location        │ VARCHAR(255) NOT NULL
│     venue           │ VARCHAR(255)
│     city            │ VARCHAR(100) NOT NULL
│     country         │ VARCHAR(100) NOT NULL
│     date            │ TIMESTAMP NOT NULL
│     price           │ DECIMAL(10,2) NOT NULL
│     total_tickets   │ INT NOT NULL
│     available_tickets│ INT NOT NULL
│     status          │ ENUM('upcoming', 'cancelled', 'completed')
│     created_at      │ TIMESTAMP DEFAULT NOW()
│     updated_at      │ TIMESTAMP
└─────────────────────┘
          │
          │ N
          │
          │ 1
          ▼
┌─────────────────────┐
│      ARTISTS        │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│     name            │ VARCHAR(255) NOT NULL
│     image_url       │ TEXT
│     bio             │ TEXT
│     genre           │ VARCHAR(100)
│     creation_date   │ INT (année)
│     first_album     │ VARCHAR(255)
│     spotify_id      │ VARCHAR(255)
│     music_sample_url│ TEXT
│     created_at      │ TIMESTAMP DEFAULT NOW()
│     updated_at      │ TIMESTAMP
└─────────────────────┘
          │
          │ 1
          │
          │ N
          ▼
┌─────────────────────┐
│   ARTIST_MEMBERS    │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│ FK  artist_id       │ INT NOT NULL
│     name            │ VARCHAR(255) NOT NULL
│     role            │ VARCHAR(100)
│     order           │ INT
└─────────────────────┘


┌─────────────────────┐
│     PAYMENTS        │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│ FK  booking_id      │ INT NOT NULL (UNIQUE)
│ FK  user_id         │ INT NOT NULL
│     stripe_payment_id│ VARCHAR(255) UNIQUE
│     stripe_session_id│ VARCHAR(255) UNIQUE
│     amount          │ DECIMAL(10,2) NOT NULL
│     currency        │ VARCHAR(3) DEFAULT 'EUR'
│     status          │ ENUM('pending', 'succeeded', 'failed', 'refunded')
│     payment_method  │ VARCHAR(50)
│     created_at      │ TIMESTAMP DEFAULT NOW()
│     updated_at      │ TIMESTAMP
└─────────────────────┘
          │
          │ 1
          │
          │ 1
          ▼
       BOOKINGS (relation 1-1)


┌─────────────────────┐
│  PASSWORD_RESETS    │
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│ FK  user_id         │ INT NOT NULL
│     token           │ VARCHAR(255) NOT NULL UNIQUE
│     expires_at      │ TIMESTAMP NOT NULL
│     used            │ BOOLEAN DEFAULT false
│     created_at      │ TIMESTAMP DEFAULT NOW()
└─────────────────────┘


┌─────────────────────┐
│   AUDIT_LOGS        │ (optionnel pour admin)
├─────────────────────┤
│ PK  id              │ INT AUTO_INCREMENT
│ FK  user_id         │ INT
│     action          │ VARCHAR(100) NOT NULL
│     table_name      │ VARCHAR(50)
│     record_id       │ INT
│     old_values      │ JSON
│     new_values      │ JSON
│     ip_address      │ VARCHAR(45)
│     user_agent      │ TEXT
│     created_at      │ TIMESTAMP DEFAULT NOW()
└─────────────────────┘
```

## Relations

### Relations principales :
1. **USERS** ─(1,N)─ **BOOKINGS** : Un utilisateur peut faire plusieurs réservations
2. **CONCERTS** ─(1,N)─ **BOOKINGS** : Un concert peut avoir plusieurs réservations
3. **ARTISTS** ─(1,N)─ **CONCERTS** : Un artiste peut avoir plusieurs concerts
4. **ARTISTS** ─(1,N)─ **ARTIST_MEMBERS** : Un artiste a plusieurs membres
5. **BOOKINGS** ─(1,1)─ **PAYMENTS** : Une réservation a un paiement (relation 1-1)
6. **USERS** ─(1,N)─ **PAYMENTS** : Un utilisateur peut faire plusieurs paiements

## Contraintes et Index

```sql
-- Index pour performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_concerts_artist_id ON concerts(artist_id);
CREATE INDEX idx_concerts_date ON concerts(date);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_concert_id ON bookings(concert_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_stripe_payment_id ON payments(stripe_payment_id);

-- Contraintes de clés étrangères
ALTER TABLE bookings 
  ADD CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_bookings_concert FOREIGN KEY (concert_id) REFERENCES concerts(id) ON DELETE CASCADE;

ALTER TABLE concerts
  ADD CONSTRAINT fk_concerts_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;

ALTER TABLE artist_members
  ADD CONSTRAINT fk_members_artist FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;

ALTER TABLE payments
  ADD CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
```

## Règles métier

1. **Authentification** :
   - Un utilisateur peut s'inscrire avec email/password OU OAuth Google
   - Le champ `password_hash` est NULL si OAuth
   - Le champ `google_id` est NULL si email/password

2. **Réservations** :
   - `available_tickets` = `total_tickets` - somme des `quantity` des bookings confirmés
   - Une réservation ne peut être faite que si `available_tickets >= quantity`
   - Statuts : pending (en attente de paiement) → confirmed (payée) ou cancelled

3. **Paiements** :
   - Relation 1-1 avec BOOKINGS
   - Le paiement est créé lors de l'intention de paiement Stripe
   - Status synchronisé avec les webhooks Stripe

4. **Concerts** :
   - Un concert ne peut être supprimé s'il a des bookings confirmés
   - `status` : upcoming (à venir), cancelled (annulé), completed (terminé)

5. **Admin** :
   - Seuls les users avec `is_admin = true` peuvent accéder au panel admin
   - CRUD sur artists, concerts, vue des paiements et users

## Diagramme visuel simplifié

```
        ┌──────────┐
        │  USERS   │
        └────┬─────┘
             │ 1:N
        ┌────▼──────┐          ┌───────────┐
        │ BOOKINGS  │◄────1:1──┤ PAYMENTS  │
        └────┬──────┘          └───────────┘
             │ N:1
        ┌────▼────────┐
        │  CONCERTS   │
        └────┬────────┘
             │ N:1
        ┌────▼──────┐         ┌────────────────┐
        │  ARTISTS  │────1:N─►│ ARTIST_MEMBERS │
        └───────────┘         └────────────────┘
```

## Notes pour la migration

- Utiliser **GORM** (Go ORM) pour les migrations automatiques
- Créer un fichier `migrations/` avec versioning
- Exemple : `001_create_users_table.go`, `002_create_artists_table.go`, etc.
- Toujours faire des migrations **up** et **down** pour rollback

## Données de seed (à créer)

- 10-20 artistes avec vrais noms et images
- 30-50 concerts sur les 6 prochains mois
- 1 admin user (admin@groupietracker.com)
- Quelques users de test
