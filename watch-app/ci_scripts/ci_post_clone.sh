#!/bin/bash
# ci_post_clone.sh — runs after Xcode Cloud clones the repo
# Installs XcodeGen and regenerates the Xcode project from project.yml

set -e

cd "$CI_PRIMARY_REPOSITORY_PATH/watch-app"

# Install XcodeGen via Homebrew (Xcode Cloud has Homebrew preinstalled)
brew install xcodegen 2>/dev/null || true

# Regenerate the project
xcodegen generate

echo "✅ XcodeGen project regenerated for Xcode Cloud"
