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

var Client *minio.Client

func InitMinIO() {
	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKeyID := os.Getenv("MINIO_ACCESS_KEY")
	secretAccessKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")
	useSSL := false 

	var err error
	Client, err = minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})

	if err != nil {
		log.Fatalf("❌ Erreur connexion MinIO: %v", err)
	}

	exists, err := Client.BucketExists(context.Background(), bucketName)
	if err != nil {
		log.Printf("⚠️  Attention: Impossible de vérifier le bucket MinIO: %v", err)
	} else if !exists {
		log.Printf("⚠️  Attention: Le bucket '%s' n'existe pas encore. Pense à le créer dans l'interface MinIO.", bucketName)
	} else {
		log.Printf("✅ Connecté à MinIO avec succès (Bucket: %s)", bucketName)
	}
}

func UploadFile(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	ctx := context.Background()
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	uniqueName := fmt.Sprintf("%d-%s", time.Now().Unix(), filepath.Base(fileHeader.Filename))

	opts := minio.PutObjectOptions{
		ContentType: fileHeader.Header.Get("Content-Type"),
	}

	info, err := Client.PutObject(ctx, bucketName, uniqueName, file, fileHeader.Size, opts)
	if err != nil {
		return "", err
	}

	log.Printf("✅ Fichier uploadé: %s (Taille: %d bytes)", uniqueName, info.Size)


	publicHost := "http://localhost:9000"

	fileURL := fmt.Sprintf("%s/%s/%s", publicHost, bucketName, uniqueName)

	return fileURL, nil
}