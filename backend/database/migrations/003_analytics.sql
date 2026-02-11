
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);

ALTER TABLE artists ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE artists ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_concerts_date ON concerts(date);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON reservations(created_at);
CREATE INDEX IF NOT EXISTS idx_reservations_payment_status ON reservations(payment_status);
