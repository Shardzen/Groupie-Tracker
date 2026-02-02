package storage

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Variable globale pour utiliser le client partout
var Client *minio.Client

func InitMinIO() {
	// 1. Récupération des variables d'environnement
	endpoint := os.Getenv("MINIO_ENDPOINT") // ex: localhost:9000
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	useSSL := false // On est en local, donc pas de HTTPS (SSL)

	// 2. Initialisation du client MinIO
	var err error
	Client, err = minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})

	if err != nil {
		log.Fatalln("❌ Erreur de connexion à MinIO:", err)
	}

	log.Println("✅ Connecté à MinIO avec succès !")
}

func UploadFile(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	ctx := context.Background()
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	// Création d'un nom unique pour éviter d'écraser les fichiers
	uniqueName := fmt.Sprintf("%d-%s", time.Now().Unix(), filepath.Base(fileHeader.Filename))

	opts := minio.PutObjectOptions{
		ContentType: fileHeader.Header.Get("Content-Type"),
	}

	// Upload du fichier
	info, err := Client.PutObject(ctx, bucketName, uniqueName, file, fileHeader.Size, opts)
	if err != nil {
		return "", err
	}

	log.Printf("✅ Fichier uploadé: %s (Taille: %d bytes)", uniqueName, info.Size)

	// Construction de l'URL publique pour le Frontend
	// Attention: Assure-toi que ton bucket est en mode "Public" ou "Download"
	publicHost := "http://localhos&t:9000" 
	fileURL := fmt.Sprintf("%s/%s/%s", publicHost, bucketName, uniqueName)

	return fileURL, nil
}