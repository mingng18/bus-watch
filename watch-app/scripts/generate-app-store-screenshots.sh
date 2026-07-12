#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WATCH_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$WATCH_ROOT/fastlane/screenshots/en-US"
SRGB_PROFILE="/System/Library/ColorSync/Profiles/sRGB Profile.icc"
FFMPEG="$(command -v ffmpeg)"

swift "$SCRIPT_DIR/generate-app-store-screenshots.swift"

for screenshot in "$OUTPUT_DIR"/*.png; do
  converted="${screenshot%.png}.srgb.png"
  opaque="${screenshot%.png}.opaque.png"
  /usr/bin/sips \
    --resampleHeightWidth 496 416 \
    --matchTo "$SRGB_PROFILE" \
    "$screenshot" \
    --out "$converted" >/dev/null
  "$FFMPEG" -hide_banner -loglevel error -y \
    -i "$converted" -vf format=rgb24 -frames:v 1 "$opaque"
  rm "$converted"
  mv "$opaque" "$screenshot"
done

printf 'Generated %s screenshots in %s\n' "$(find "$OUTPUT_DIR" -maxdepth 1 -name '*.png' | wc -l | tr -d ' ')" "$OUTPUT_DIR"
