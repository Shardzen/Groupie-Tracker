#!/bin/bash

echo "================================================"
echo "   MIGRATION IMAGES GROUPIE TRACKER vers S3"
echo "================================================"
echo ""

cd "$(dirname "$0")"

echo "[1/4] Vérification de Go..."
if ! command -v go &> /dev/null; then
    echo "❌ Go n'est pas installé ou pas dans le PATH"
    echo "   Télécharger: https://go.dev/dl/"
    exit 1
fi
echo "✅ Go détecté: $(go version)"

echo ""
echo "[2/4] Installation des dépendances..."
if ! go mod download; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi
echo "✅ Dépendances installées"

echo ""
echo "[3/4] Vérification de la configuration S3..."
if ! go run check-s3-config.go; then
    echo "❌ Erreur de configuration S3"
    echo "   Vérifiez votre fichier .env dans backend/"
    exit 1
fi

echo ""
echo "================================================"
echo "   Tout est prêt pour la migration!"
echo "================================================"
echo ""
echo "⚠️  ATTENTION: Cette opération va:"
echo "   1. Uploader toutes les images vers S3"
echo "   2. Générer un nouveau mockData.ts"
echo ""
read -p "Continuer? (o/N): " confirm
if [[ ! "$confirm" =~ ^[oO]$ ]]; then
    echo "❌ Migration annulée"
    exit 0
fi

echo ""
echo "[4/4] Migration en cours..."
if ! go run migrate-images-to-s3.go; then
    echo "❌ Erreur durant la migration"
    exit 1
fi

echo ""
echo "================================================"
echo "   MIGRATION TERMINÉE ✅"
echo "================================================"
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Vérifiez le fichier: frontend/src/data/mockData.ts.new"
echo "   2. Remplacez l'ancien fichier:"
echo "      mv frontend/src/data/mockData.ts.new frontend/src/data/mockData.ts"
echo "   3. Testez votre site"
echo "   4. Supprimez les anciennes images locales (optionnel)"
echo ""
