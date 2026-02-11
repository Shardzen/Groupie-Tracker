-- Migration pour les réservations et paiements Stripe
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    concert_id INTEGER NOT NULL REFERENCES concerts(id) ON DELETE CASCADE,
    
    -- Type et quantité
    ticket_type VARCHAR(20) DEFAULT 'standard', -- 'standard' ou 'vip'
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Statuts
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'cancelled', 'expired'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'succeeded', 'failed', 'refunded'
    
    -- Identifiants Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_payment_status VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '15 minutes'
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_user_reservations ON reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_concert_reservations ON reservations(concert_id);
CREATE INDEX IF NOT EXISTS idx_stripe_intent ON reservations(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_status ON reservations(status, payment_status);

-- Fonction pour nettoyer automatiquement les réservations expirées
CREATE OR REPLACE FUNCTION cleanup_expired_reservations()
RETURNS void AS $$
BEGIN
    UPDATE reservations 
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'pending' 
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_reservation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_reservation_timestamp ON reservations;
CREATE TRIGGER set_reservation_timestamp
BEFORE UPDATE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_reservation_timestamp();

-- Vue pour les statistiques admin
CREATE OR REPLACE VIEW reservation_stats AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_reservations,
    COUNT(CASE WHEN status = 'paid' THEN 1 END) as paid_reservations,
    SUM(CASE WHEN status = 'paid' THEN total_price ELSE 0 END) as revenue,
    AVG(CASE WHEN status = 'paid' THEN total_price END) as avg_order_value
FROM reservations
GROUP BY DATE(created_at)
ORDER BY date DESC;
