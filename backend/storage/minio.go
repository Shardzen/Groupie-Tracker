package storage

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
	"strings"
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

	useSSL := !strings.Contains(endpoint, "localhost") && !strings.Contains(endpoint, "127.0.0.1")

	var err error
	Client, err = minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: useSSL,
	})

	if err != nil {
		log.Fatalln("❌ Erreur de connexion à MinIO/S3:", err)
	}

	if !useSSL { 
		ctx := context.Background()
		exists, err := Client.BucketExists(ctx, bucketName)
		if err == nil && !exists {
			Client.MakeBucket(ctx, bucketName, minio.MakeBucketOptions{})
			log.Printf("📂 Bucket '%s' créé automatiquement.", bucketName)
		}
	}

	log.Println("✅ Client Storage initialisé avec succès sur :", endpoint)
}

func UploadFile(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
    ctx := context.Background()
    bucketName := os.Getenv("MINIO_BUCKET_NAME")
    endpoint := os.Getenv("MINIO_ENDPOINT")

    // 1. Récupérer l'extension (ex: .jpg)
    ext := filepath.Ext(fileHeader.Filename)

    // 2. Récupérer le nom sans l'extension (ex: mon-image)
    name := strings.TrimSuffix(fileHeader.Filename, ext)

    // 3. Créer un nom unique : Timestamp - Nom - Extension
    // C'est ICI qu'on utilise la variable 'ext', ce qui corrige l'erreur
    uniqueName := fmt.Sprintf("%d-%s%s", time.Now().Unix(), name, ext)

    // Nettoyage : remplace les espaces par des tirets bas pour éviter les soucis d'URL
    uniqueName = strings.ReplaceAll(uniqueName, " ", "_")

    opts := minio.PutObjectOptions{
        ContentType: fileHeader.Header.Get("Content-Type"),
    }

    // Upload du fichier
    info, err := Client.PutObject(ctx, bucketName, uniqueName, file, fileHeader.Size, opts)
    if err != nil {
        return "", fmt.Errorf("erreur upload: %v", err)
    }

    log.Printf("✅ Fichier uploadé: %s (Taille: %d bytes)", uniqueName, info.Size)

    // --- Génération de l'URL ---
    var fileURL string

    if strings.Contains(endpoint, "amazonaws.com") {
        // Format AWS
        fileURL = fmt.Sprintf("https://%s.%s/%s", bucketName, endpoint, uniqueName)
    } else {
        // Format MinIO Local (localhost)
        // Utilise http, localhost et le port
        fileURL = fmt.Sprintf("http://%s/%s/%s", endpoint, bucketName, uniqueName)
    }

    // Encodage propre de l'URL
    u, err := url.Parse(fileURL)
    if err == nil {
        return u.String(), nil
    }

    return fileURL, nil
}