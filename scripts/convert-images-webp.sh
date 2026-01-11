#!/bin/bash

# Script de conversion images → WebP
# Usage: ./scripts/convert-images-webp.sh

set -e

echo "🖼️  Conversion images vers WebP..."

# Dossiers source (ajustés à la structure réelle)
SOURCE_DIRS=(
  "/Users/franckvictorien/.gemini/antigravity/scratch/TEDSAI_AI_VENTURE/assets/images"
  "/Users/franckvictorien/.gemini/antigravity/scratch/TEDSAI_AI_VENTURE/public/images"
)

# Qualité WebP
QUALITY=80

# Compteurs
TOTAL=0
CONVERTED=0

# Fonction de conversion
convert_image() {
  local input="$1"
  local output="${input%.*}.webp"
  
  if [ -f "$output" ]; then
    echo "⏭️  Déjà converti: $(basename "$input")"
    return
  fi
  
  echo "🔄 Conversion: $(basename "$input")"
  
  # Conversion avec cwebp si dispo, sinon convert (ImageMagick)
  if command -v cwebp &> /dev/null; then
    cwebp -q $QUALITY "$input" -o "$output"
  elif command -v convert &> /dev/null; then
    convert "$input" -quality $QUALITY "$output"
  else
    echo "❌ Erreur: cwebp ou ImageMagick non trouvé. Installez-les avec 'brew install webp imagemagick'"
    exit 1
  fi
  
  ((CONVERTED++))
}

# Parcourir dossiers
for DIR in "${SOURCE_DIRS[@]}"; do
  if [ ! -d "$DIR" ]; then
    echo "⚠️  Dossier introuvable: $DIR"
    continue
  fi
  
  echo ""
  echo "📁 Traitement: $DIR"
  
  # Trouver toutes les images recursives
  find "$DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -print0 | while IFS= read -r -d '' file; do
    ((TOTAL++))
    convert_image "$file"
  done
done

echo ""
echo "✅ Conversion terminée: $CONVERTED/$TOTAL images traitées"
