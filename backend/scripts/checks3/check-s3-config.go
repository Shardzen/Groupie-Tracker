package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

func main() {
	// Charger .env
if err := godotenv.Load(".env"); err != nil {
				log.Println("⚠️  Fichier .env non trouvé, utilisation des variables système")
	}

	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	if endpoint == "" || accessKey == "" || secretKey == "" || bucketName == "" {
		log.Fatal("❌ Variables d'environnement manquantes")
	}

	// Connexion S3
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: true,
	})
	if err != nil {
		log.Fatalf("❌ Erreur connexion: %v", err)
	}

	ctx := context.Background()

	// 1. Vérifier l'existence du bucket
	exists, err := client.BucketExists(ctx, bucketName)
	if err != nil {
		log.Fatalf("❌ Erreur vérification bucket: %v", err)
	}
	if !exists {
		log.Fatalf("❌ Le bucket '%s' n'existe pas", bucketName)
	}
	log.Printf("✅ Bucket '%s' trouvé\n", bucketName)

	// 2. Vérifier la région
	region, err := client.GetBucketLocation(ctx, bucketName)
	if err != nil {
		log.Printf("⚠️  Impossible de récupérer la région: %v\n", err)
	} else {
		log.Printf("📍 Région: %s\n", region)
	}

	// 3. Tester l'upload d'un fichier de test
	testContent := "Test upload S3"
	testKey := "test/test-image.txt"

	_, err = client.PutObject(ctx, bucketName, testKey, 
		nil, 0, minio.PutObjectOptions{})
	
	// Créer un fichier temporaire
	tmpFile, err := os.CreateTemp("", "test-*.txt")
	if err != nil {
		log.Fatalf("❌ Erreur création fichier temporaire: %v", err)
	}
	defer os.Remove(tmpFile.Name())
	
	tmpFile.WriteString(testContent)
	tmpFile.Close()

	info, err := client.FPutObject(ctx, bucketName, testKey, tmpFile.Name(), minio.PutObjectOptions{
		ContentType: "text/plain",
	})
	if err != nil {
		log.Fatalf("❌ Erreur upload test: %v\n", err)
	}
	log.Printf("✅ Upload test réussi (%d bytes)\n", info.Size)

	// 4. Générer l'URL publique
	publicURL := fmt.Sprintf("https://%s.%s/%s", bucketName, endpoint, testKey)
	log.Printf("🔗 URL test: %s\n", publicURL)
	log.Println("📌 Testez cette URL dans votre navigateur pour vérifier l'accès public")

	// 5. Supprimer le fichier de test
	err = client.RemoveObject(ctx, bucketName, testKey, minio.RemoveObjectOptions{})
	if err != nil {
		log.Printf("⚠️  Impossible de supprimer le fichier test: %v\n", err)
	} else {
		log.Println("🧹 Fichier test supprimé")
	}

	// 6. Afficher les recommendations
	log.Println("\n📋 Checklist avant migration:")
	log.Println("   ✓ Bucket existe et accessible")
	log.Println("   ⚠️  Vérifiez que le bucket a une politique publique")
	log.Println("   ⚠️  Vérifiez que CORS est configuré si nécessaire")
	log.Println("\n💡 Pour configurer l'accès public, allez dans AWS Console:")
	log.Println("   S3 > Votre Bucket > Permissions > Bucket Policy")
	log.Println("   Ajoutez cette politique pour permettre l'accès public aux images:")
	
	policy := fmt.Sprintf(`{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::%s/artists/*"
        }
    ]
}`, bucketName)

	log.Println(policy)
}
