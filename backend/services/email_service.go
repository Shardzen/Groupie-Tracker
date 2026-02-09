package services

import (
	"fmt"
	"net/smtp"
	"os"
)

// SendEmail sends an email using SMTP
func SendEmail(to, subject, body string) error {
	from := os.Getenv("SMTP_FROM")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	if from == "" || password == "" || smtpHost == "" || smtpPort == "" {
		return fmt.Errorf("SMTP configuration missing")
	}

	message := []byte(fmt.Sprintf("To: %s\r\nSubject: %s\r\n\r\n%s", to, subject, body))

	auth := smtp.PlainAuth("", from, password, smtpHost)
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)

	err := smtp.SendMail(addr, auth, from, []string{to}, message)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

// SendHTMLEmail sends an HTML formatted email
func SendHTMLEmail(to, subject, htmlBody string) error {
	from := os.Getenv("SMTP_FROM")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	if from == "" || password == "" || smtpHost == "" || smtpPort == "" {
		return fmt.Errorf("SMTP configuration missing")
	}

	headers := map[string]string{
		"From":         from,
		"To":           to,
		"Subject":      subject,
		"MIME-Version": "1.0",
		"Content-Type": "text/html; charset=UTF-8",
	}

	message := ""
	for k, v := range headers {
		message += fmt.Sprintf("%s: %s\r\n", k, v)
	}
	message += "\r\n" + htmlBody

	auth := smtp.PlainAuth("", from, password, smtpHost)
	addr := fmt.Sprintf("%s:%s", smtpHost, smtpPort)

	err := smtp.SendMail(addr, auth, from, []string{to}, []byte(message))
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}
func SendVerificationEmail(toEmail string, token string) error {
    // 1. On construit le lien qui pointe vers ton API de vérification
    // On utilise l'adresse de ton backend définie dans main.go (8080)
    verificationLink := fmt.Sprintf("http://localhost:8080/api/auth/verify-email?token=%s", token)

    subject := "🎸 Active ton compte YNOT !"
    
    // 2. On prépare un joli corps de mail en HTML
    htmlBody := fmt.Sprintf(`
        <div style="font-family: Arial, sans-serif; text-align: center;">
            <h1 style="color: #ff4757;">YNOT</h1>
            <p>Salut ! Merci de nous rejoindre. Clique sur le bouton ci-dessous pour valider ton inscription :</p>
            <div style="margin: 30px;">
                <a href="%s" style="background-color: #ff4757; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    ACTIVER MON COMPTE
                </a>
            </div>
            <p style="color: #777; font-size: 12px;">Si le bouton ne fonctionne pas, copie ce lien : %s</p>
        </div>
    `, verificationLink, verificationLink)

    // 3. On utilise ta fonction existante pour envoyer le tout
    return SendHTMLEmail(toEmail, subject, htmlBody)
}