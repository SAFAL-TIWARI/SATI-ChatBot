#!/bin/bash

# Run this script from inside the 'res' folder
BASE_DIR="."  # Current directory is res/
SRC_ICON="$BASE_DIR/ic_launcher.png"
SRC_ICON_ROUND="$BASE_DIR/ic_launcher_round.png"

# Check for ImageMagick's convert tool
if ! command -v convert &> /dev/null; then
    echo "Error: ImageMagick 'convert' not found. Install with: sudo apt install imagemagick"
    exit 1
fi

# Check for the presence of base icons
if [[ ! -f "$SRC_ICON" ]]; then
    echo "Error: Missing $SRC_ICON"
    exit 1
fi

# Density-to-size map
declare -A sizes=(
  [mipmap-mdpi]=48
  [mipmap-hdpi]=72
  [mipmap-xhdpi]=96
  [mipmap-xxhdpi]=144
  [mipmap-xxxhdpi]=192
)

# Generate standard icons
for dir in "${!sizes[@]}"; do
    mkdir -p "$BASE_DIR/$dir"
    convert "$SRC_ICON" -resize ${sizes[$dir]}x${sizes[$dir]} "$BASE_DIR/$dir/ic_launcher.png"
done

# Generate round icons if available
if [[ -f "$SRC_ICON_ROUND" ]]; then
    for dir in "${!sizes[@]}"; do
        convert "$SRC_ICON_ROUND" -resize ${sizes[$dir]}x${sizes[$dir]} "$BASE_DIR/$dir/ic_launcher_round.png"
    done
else
    echo "Note: Round icon ($SRC_ICON_ROUND) not found, skipping round icons."
fi

echo "Launcher icons have been generated and placed in mipmap folders."
