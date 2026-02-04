package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/joho/godotenv"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Configuration des images d'artistes
var artistImages = map[string]string{
	"ninho.jpg.jpg":       "1",
	"angele.jpg.webp":     "2",
	"gojira.jpg":          "3",
	"orelsan.jpg":         "4",
	"daftpunk.jpg":        "5",
	"pnl.jpg":             "6",
	"leto.jpg":            "7",
	"nonolagrinta.jpg":    "8",
	"keeqaid.jpg":         "9",
	"timar.jpg":           "10",
	"lamano.jpg":          "11",
	"theweeknd.jpg":       "12",
	"dualipa.jpg":         "13",
	"stromae.jpg":         "14",
	"nakamura.jpg":        "15",
	"metallica.jpg":       "16",
	"rammstein.jpg":       "17",
	"systemofadown.jpg":   "18",
	"djsnake.jpg":         "19",
	"davidguetta.jpg":     "20",
	"kavinsky.jpg":        "21",
	"hamza.jpg":           "22",
	"laylow.jpg":          "23",
}

func main() {
	// Charger les variables d'environnement
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("⚠️  Fichier .env non trouvé, utilisation des variables système")
	}

	endpoint := os.Getenv("MINIO_ENDPOINT")
	accessKey := os.Getenv("MINIO_ACCESS_KEY")
	secretKey := os.Getenv("MINIO_SECRET_KEY")
	bucketName := os.Getenv("MINIO_BUCKET_NAME")

	if endpoint == "" || accessKey == "" || secretKey == "" || bucketName == "" {
		log.Fatal("❌ Variables d'environnement manquantes (MINIO_*)")
	}

	// Connexion à S3/MinIO
	useSSL := !strings.Contains(endpoint, "localhost")
	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})
	if err != nil {
		log.Fatalf("❌ Erreur connexion S3: %v", err)
	}

	ctx := context.Background()

	// Vérifier que le bucket existe
	exists, err := client.BucketExists(ctx, bucketName)
	if err != nil {
		log.Fatalf("❌ Erreur vérification bucket: %v", err)
	}
	if !exists {
		log.Fatalf("❌ Le bucket '%s' n'existe pas", bucketName)
	}

	log.Printf("✅ Connecté à %s (bucket: %s)\n", endpoint, bucketName)
	log.Println("🚀 Début de la migration des images...\n")

	// Chemin des images locales
	imagesDir := "../../frontend/public/artists"

	successCount := 0
	errorCount := 0

	// Upload de chaque image
	for filename, artistID := range artistImages {
		localPath := filepath.Join(imagesDir, filename)

		// Vérifier que le fichier existe
		if _, err := os.Stat(localPath); os.IsNotExist(err) {
			log.Printf("⚠️  Image non trouvée: %s\n", filename)
			errorCount++
			continue
		}

		// Nouveau nom dans S3 : artists/{id}/{filename}
		s3Key := fmt.Sprintf("artists/%s/%s", artistID, filename)

		// Upload
		info, err := client.FPutObject(ctx, bucketName, s3Key, localPath, minio.PutObjectOptions{
			ContentType: getContentType(filename),
		})
		if err != nil {
			log.Printf("❌ Erreur upload %s: %v\n", filename, err)
			errorCount++
			continue
		}

		// Générer l'URL publique
		publicURL := fmt.Sprintf("https://%s.%s/%s", bucketName, endpoint, s3Key)

		log.Printf("✅ %s → %s (%.2f KB)\n", filename, publicURL, float64(info.Size)/1024)
		successCount++
	}

	log.Printf("\n📊 Migration terminée: %d succès, %d erreurs\n", successCount, errorCount)

	// Générer le nouveau mockData.ts
	if successCount > 0 {
		log.Println("\n📝 Génération du nouveau mockData.ts...")
		generateMockData(bucketName, endpoint)
	}
}

func getContentType(filename string) string {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".webp":
		return "image/webp"
	case ".gif":
		return "image/gif"
	default:
		return "application/octet-stream"
	}
}

func generateMockData(bucketName, endpoint string) {
	// Mapping filename → artistID → URL
	urls := make(map[string]string)

	for filename, artistID := range artistImages {
		s3Key := fmt.Sprintf("artists/%s/%s", artistID, filename)
		urls[artistID] = fmt.Sprintf("https://%s.%s/%s", bucketName, endpoint, s3Key)
	}

	output := `// 🚀 FICHIER GÉNÉRÉ AUTOMATIQUEMENT - Ne pas modifier manuellement
// Migration effectuée le: ` + fmt.Sprintf("%v", os.Getenv("DATE")) + `

export interface Track {
  title: string;
  plays: string;
  duration: string;
  previewUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  image: string;
  bio: string;
  topTracks: Track[]
  upcomingDates: ConcertDate[];
}

export interface ConcertDate {
  id: string;
  venue: string;
  city: string;
  date: string;
  ticketsUrl: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  city: string;
  date: string;
  image: string;
  artistName: string;
  standardPrice: number;
  vipPrice: number;
}

export const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'Ninho',
    genre: 'Rap FR',
    image: '` + urls["1"] + `',
    bio: 'Le recordman du rap français.',
    topTracks: [
      { 
        title: 'Jefe', 
        plays: '145M', 
        duration: '3:12',
        previewUrl: 'https://cdns-preview-d.dzcdn.net/stream/c-d8f5b81a6243ddfa4c97b6a4b8c6d40b-4.mp3' 
      },
      { 
        title: 'Lettre à une femme', 
        plays: '120M', 
        duration: '2:58',
        previewUrl: 'https://cdns-preview-9.dzcdn.net/stream/c-922634e062f928e08d6c703d1544a031-4.mp3'
      }
    ],
    upcomingDates: []
  },
  {
    id: '2',
    name: 'Angèle',
    genre: 'Pop',
    image: '` + urls["2"] + `',
    bio: 'La reine de la pop belge.',
    topTracks: [
      { 
        title: 'Bruxelles je t\'aime', 
        plays: '95M', 
        duration: '3:45', 
        previewUrl: 'https://cdns-preview-b.dzcdn.net/stream/c-b93952701f6630f55e0031846c434226-6.mp3'
      },
      { 
        title: 'Balance ton quoi', 
        plays: '110M', 
        duration: '3:10',
        previewUrl: 'https://cdns-preview-8.dzcdn.net/stream/c-89260c07d353683f12b6946059632832-6.mp3'
      }
    ],
    upcomingDates: []
  },
  {
    id: '3',
    name: 'Gojira',
    genre: 'Metal',
    image: '` + urls["3"] + `',
    bio: 'La puissance du metal français.',
    topTracks: [
      { title: 'Stranded', plays: '80M', duration: '4:30' },
      { title: 'Silvera', plays: '70M', duration: '3:50' }
    ],
    upcomingDates: []
  },
  {
    id: '4',
    name: 'Orelsan',
    genre: 'Rap FR',
    image: '` + urls["4"] + `',
    bio: 'Civilisation. La plume la plus aiguisée de Caen.',
    topTracks: [
      { title: 'La Quête', plays: '90M', duration: '4:00' },
      { title: 'Basique', plays: '150M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '5',
    name: 'Daft Punk',
    genre: 'Electro',
    image: '` + urls["5"] + `',
    bio: 'Les légendes. One More Time.',
    topTracks: [
        { title: 'One More Time', plays: '500M', duration: '5:20' }
    ],
    upcomingDates: []
  },
  {
    id: '6',
    name: 'PNL',
    genre: 'Rap Cloud',
    image: '` + urls["6"] + `',
    bio: 'Deux frères. QLF.',
    topTracks: [
        { title: 'Au DD', plays: '300M', duration: '4:00' }
    ],
    upcomingDates: []
  },
  {
    id: '7',
    name: 'Leto',
    genre: 'Rap FR',
    image: '` + urls["7"] + `',
    bio: 'Le roi de la Trap parisienne. Capitaine Jackson.',
    topTracks: [
      { title: 'Macaroni', plays: '80M', duration: '3:20' },
      { title: 'Tes parents', plays: '65M', duration: '3:45' }
    ],
    upcomingDates: []
  },
  {
    id: '8',
    name: 'Nono La Grinta',
    genre: 'Rap FR',
    image: '` + urls["8"] + `',
    bio: 'La nouvelle pépite du 91. Flow agressif et technique.',
    topTracks: [
      { title: 'LA QUOI??', plays: '15M', duration: '2:50' },
      { title: 'Paris', plays: '10M', duration: '3:00' }
    ],
    upcomingDates: []
  },
  {
    id: '9',
    name: 'Keeqaid',
    genre: 'Rap FR',
    image: '` + urls["9"] + `',
    bio: 'Le futur de la scène. Un style unique qui mélange les genres.',
    topTracks: [
      { title: 'Tequila', plays: '5M', duration: '2:40' },
      { title: 'Coachella', plays: '4M', duration: '3:10' }
    ],
    upcomingDates: []
  },
  {
    id: '10',
    name: 'Timar',
    genre: 'Rap FR',
    image: '` + urls["10"] + `',
    bio: 'Une voix qui marque et des textes qui percutent.',
    topTracks: [
      { title: 'Sierra Leone', plays: '3M', duration: '2:55' },
      { title: '4h44', plays: '2M', duration: '3:05' }
    ],
    upcomingDates: []
  },
  {
    id: '11',
    name: 'Lamano',
    genre: 'Rap FR',
    image: '` + urls["11"] + `',
    bio: 'L\'étoile montante. À suivre de très près cette année.',
    topTracks: [
      { title: 'Im sorry', plays: '8M', duration: '2:30' },
      { title: 'Canon', plays: '6M', duration: '2:45' }
    ],
    upcomingDates: []
  },
  {
    id: '12',
    name: 'The Weeknd',
    genre: 'Pop',
    image: '` + urls["12"] + `',
    bio: 'Starboy. L\'artiste le plus écouté au monde.',
    topTracks: [
      { title: 'Blinding Lights', plays: '3B', duration: '3:20' },
      { title: 'Starboy', plays: '2B', duration: '3:50' }
    ],
    upcomingDates: []
  },
  {
    id: '13',
    name: 'Dua Lipa',
    genre: 'Pop',
    image: '` + urls["13"] + `',
    bio: 'La reine du Disco Pop moderne.',
    topTracks: [
      { title: 'Levitating', plays: '1.5B', duration: '3:23' },
      { title: 'Don\'t Start Now', plays: '1.8B', duration: '3:03' }
    ],
    upcomingDates: []
  },
  {
    id: '14',
    name: 'Stromae',
    genre: 'Pop',
    image: '` + urls["14"] + `',
    bio: 'Le maestro belge. Des textes sombres sur des rythmes dansants.',
    topTracks: [
      { title: 'Alors on danse', plays: '900M', duration: '3:26' },
      { title: 'Papaoutai', plays: '800M', duration: '3:52' }
    ],
    upcomingDates: []
  },
  {
    id: '15',
    name: 'Aya Nakamura',
    genre: 'Pop',
    image: '` + urls["15"] + `',
    bio: 'La reine de France. L\'artiste francophone la plus écoutée à l\'international.',
    topTracks: [
      { title: 'Djadja', plays: '850M', duration: '2:50' },
      { title: 'Pookie', plays: '600M', duration: '3:00' }
    ],
    upcomingDates: []
  },
  {
    id: '16',
    name: 'Metallica',
    genre: 'Metal',
    image: '` + urls["16"] + `',
    bio: 'Les pères fondateurs du Thrash Metal.',
    topTracks: [
      { title: 'Enter Sandman', plays: '1B', duration: '5:31' },
      { title: 'Master of Puppets', plays: '900M', duration: '8:35' }
    ],
    upcomingDates: []
  },
  {
    id: '17',
    name: 'Rammstein',
    genre: 'Metal',
    image: '` + urls["17"] + `',
    bio: 'Le metal industriel allemand à son paroxysme. Du feu et de la fureur.',
    topTracks: [
      { title: 'Du Hast', plays: '600M', duration: '3:54' },
      { title: 'Sonne', plays: '500M', duration: '4:32' }
    ],
    upcomingDates: []
  },
  {
    id: '18',
    name: 'System of a Down',
    genre: 'Metal',
    image: '` + urls["18"] + `',
    bio: 'L\'énergie brute arméno-américaine.',
    topTracks: [
      { title: 'Chop Suey!', plays: '1.2B', duration: '3:30' },
      { title: 'Toxicity', plays: '900M', duration: '3:39' }
    ],
    upcomingDates: []
  },
  {
    id: '19',
    name: 'DJ Snake',
    genre: 'Electro',
    image: '` + urls["19"] + `',
    bio: 'Le français qui fait danser la planète entière.',
    topTracks: [
      { title: 'Turn Down for What', plays: '1.1B', duration: '3:33' },
      { title: 'Let Me Love You', plays: '1.8B', duration: '3:25' }
    ],
    upcomingDates: []
  },
  {
    id: '20',
    name: 'David Guetta',
    genre: 'Electro',
    image: '` + urls["20"] + `',
    bio: 'Le numéro 1 mondial des platines.',
    topTracks: [
      { title: 'Sexy Bitch', plays: '1.5B', duration: '4:05' },
      { title: 'Memories', plays: '1.2B', duration: '2:55' }
    ],
    upcomingDates: []
  },
  {
    id: '21',
    name: 'Kavinsky',
    genre: 'Electro',
    image: '` + urls["21"] + `',
    bio: 'Synthwave legend. Nightcall.',
    topTracks: [
      { title: 'Nightcall', plays: '400M', duration: '4:18' },
      { title: 'Roadgame', plays: '100M', duration: '3:44' }
    ],
    upcomingDates: []
  },
  {
    id: '22',
    name: 'Hamza',
    genre: 'Rap Cloud',
    image: '` + urls["22"] + `',
    bio: 'Le Sauce God belge. Des mélodies imparables.',
    topTracks: [
      { title: 'Life', plays: '80M', duration: '3:05' },
      { title: 'Fade Up', plays: '110M', duration: '3:30' }
    ],
    upcomingDates: []
  },
  {
    id: '23',
    name: 'Laylow',
    genre: 'Rap Cloud',
    image: '` + urls["23"] + `',
    bio: 'L\'étrange histoire de Mr. Anderson. Digital et émotionnel.',
    topTracks: [
      { title: 'Megatron', plays: '45M', duration: '3:20' },
      { title: 'Special', plays: '40M', duration: '3:15' }
    ],
    upcomingDates: []
  }
];

export const mockEvents: Event[] = [];
`

	outputPath := "../../frontend/src/data/mockData.ts.new"
	if err := os.WriteFile(outputPath, []byte(output), 0644); err != nil {
		log.Printf("❌ Erreur génération mockData.ts: %v\n", err)
		return
	}

	log.Printf("✅ Nouveau mockData.ts généré: %s\n", outputPath)
	log.Println("📌 Remplacez manuellement frontend/src/data/mockData.ts par ce fichier")
}
