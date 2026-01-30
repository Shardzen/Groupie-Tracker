package storage

import (
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/url"
	"os"
	"path/filepath"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var Client *minio.Client

func InitMinIO() {
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

	minioEndpoint := os.Getenv("MINIO_ENDPOINT") 
    

    publicHost := "http://localhost:9000" 

	fileURL := fmt.Sprintf("%s/%s/%s", publicHost, bucketName, uniqueName)

	return fileURL, nil
}