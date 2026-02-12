package services

import (
	"fmt"
	"net/smtp"
	"os"
)
func SendPasswordResetEmail(toEmail string, token string) error {
    resetLink := fmt.Sprintf("http://localhost:5173/reset-password?token=%s", token)

    subject := "🔑 Réinitialisation de ton mot de passe YNOT"
    htmlBody := fmt.Sprintf(`
        <div style="font-family: Arial, sans-serif;">
            <h2>Tu as oublié ton mot de passe ?</h2>
            <p>Pas de panique ! Clique sur le bouton ci-dessous pour en créer un nouveau :</p>
            <a href="%s" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                Changer mon mot de passe
            </a>
            <p>Ce lien expirera dans 1 heure.</p>
        </div>
    `, resetLink)

    return SendHTMLEmail(toEmail, subject, htmlBody)
}

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

    verificationLink := fmt.Sprintf("http://localhost:8080/api/auth/verify-email?token=%s", token)

    subject := "🎸 Active ton compte YNOT !"
    

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


    return SendHTMLEmail(toEmail, subject, htmlBody)
}