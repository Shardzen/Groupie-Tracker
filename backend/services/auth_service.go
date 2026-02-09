func RegisterUser(req models.RegisterRequest) (*models.User, error) {
	if req.Email == "" || req.Password == "" {
		return nil, errors.New("email et mot de passe requis")
	}
	req.Email = sanitizeInput(req.Email, 255)
	req.FirstName = sanitizeInput(req.FirstName, 100)
	req.LastName = sanitizeInput(req.LastName, 100)
	if !isValidEmail(req.Email) {
		return nil, errors.New("format d'email invalide")
	}
	if err := isStrongPassword(req.Password); err != nil {
		return nil, err
	}
	var exists bool
	err := database.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)", req.Email).Scan(&exists)
	if err != nil {
		return nil, errors.New("erreur de base de données")
	}
	if exists {
		return nil, errors.New("cet email est déjà enregistré")
	}
	hashedPassword, err := HashPassword(req.Password)
	if err != nil {
		return nil, errors.New("erreur lors du traitement du mot de passe")
	}
	var userID int
	err = database.DB.QueryRow(
		`INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified) 
		VALUES ($1, $2, $3, $4, $5, $6) 
		RETURNING id`,
		req.Email, hashedPassword, req.FirstName, req.LastName, "user", false,
	).Scan(&userID)
	if err != nil {
		return nil, errors.New("échec de la création du compte")
	}
	token := fmt.Sprintf("%x", time.Now().UnixNano())
	_, err = database.DB.Exec(
		"INSERT INTO email_verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
		userID, token, time.Now().Add(24 * time.Hour),
	)
	_ = SendVerificationEmail(req.Email, token)
	return &models.User{
		ID:        userID,
		Email:     req.Email,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Role:      "user",
	}, nil
}