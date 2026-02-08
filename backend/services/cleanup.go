package services

import (
    "database/sql"
    "log"
    "time"
)

func StartUnverifiedUserCleanup(db *sql.DB) {

    go func() {
        ticker := time.NewTicker(1 * time.Hour)
        for range ticker.C {
            query := `
                DELETE FROM users 
                WHERE email_verified = false 
                AND created_at < NOW() - INTERVAL '24 hours'`
            
            result, err := db.Exec(query)
            if err != nil {
                log.Printf("Erreur lors du nettoyage des utilisateurs : %v", err)
                continue
            }

            rows, _ := result.RowsAffected()
            if rows > 0 {
                log.Printf("🧹 Nettoyage : %d comptes non vérifiés supprimés.", rows)
            }
        }
    }()
}