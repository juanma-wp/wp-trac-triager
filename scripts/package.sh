#!/bin/bash

# WP Trac Triager - Chrome Web Store Package Builder
# Usage: ./scripts/package.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get version from manifest.json
VERSION=$(grep '"version"' manifest.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

if [ -z "$VERSION" ]; then
    echo -e "${RED}❌ Error: Could not extract version from manifest.json${NC}"
    exit 1
fi

echo -e "${BLUE}📦 WP Trac Triager Packaging Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Version: ${GREEN}${VERSION}${NC}"
echo ""

# Clean up any previous release directory
if [ -d "release" ]; then
    echo -e "${YELLOW}🧹 Cleaning up previous release directory...${NC}"
    rm -rf release
fi

# Create release directory
echo -e "${BLUE}📁 Creating release directory...${NC}"
mkdir -p release/wp-trac-triager

# Copy all files except excluded ones
echo -e "${BLUE}📋 Copying extension files...${NC}"
rsync -av \
    --exclude='.git' \
    --exclude='.gitignore' \
    --exclude='node_modules' \
    --exclude='package*.json' \
    --exclude='.eslintrc*' \
    --exclude='.prettier*' \
    --exclude='.claude' \
    --exclude='store-assets' \
    --exclude='release' \
    --exclude='scripts' \
    --exclude='PUBLISHING.md' \
    --exclude='CONTRIBUTING.md' \
    --exclude='.DS_Store' \
    --exclude='*.swp' \
    --exclude='*.swo' \
    --exclude='*~' \
    . release/wp-trac-triager/

# Create ZIP file
ZIP_NAME="wp-trac-triager-v${VERSION}.zip"
echo -e "${BLUE}🗜️  Creating ZIP package: ${GREEN}${ZIP_NAME}${NC}"

cd release
zip -r "$ZIP_NAME" wp-trac-triager/ -q

# Calculate file size
FILE_SIZE=$(du -h "$ZIP_NAME" | cut -f1)

# Move ZIP to release directory root
cd ..

echo ""
echo -e "${GREEN}✅ Package created successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "📦 Package: ${GREEN}release/${ZIP_NAME}${NC}"
echo -e "📊 Size: ${GREEN}${FILE_SIZE}${NC}"
echo -e "🏷️  Version: ${GREEN}${VERSION}${NC}"
echo ""

# List contents summary
echo -e "${BLUE}📂 Package contents:${NC}"
cd release/wp-trac-triager
echo -e "  ├─ manifest.json (v${VERSION})"
echo -e "  ├─ content/ ($(ls -1 content/*.js content/*.css 2>/dev/null | wc -l | tr -d ' ') files)"
echo -e "  ├─ data/ ($(ls -1 data/*.js data/*.json 2>/dev/null | wc -l | tr -d ' ') files)"
echo -e "  ├─ icons/ ($(ls -1 icons/*.png 2>/dev/null | wc -l | tr -d ' ') files)"
echo -e "  ├─ options/ ($(ls -1 options/* 2>/dev/null | wc -l | tr -d ' ') files)"
echo -e "  ├─ popup/ ($(ls -1 popup/* 2>/dev/null | wc -l | tr -d ' ') files)"
echo -e "  ├─ README.md"
echo -e "  ├─ PRIVACY.md"
echo -e "  └─ CHANGELOG.md"
cd ../..

echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Review the package:"
echo -e "     ${BLUE}unzip -l release/${ZIP_NAME}${NC}"
echo ""
echo -e "  2. Upload to Chrome Web Store:"
echo -e "     ${BLUE}https://chrome.google.com/webstore/devconsole${NC}"
echo ""
echo -e "  3. Create GitHub release:"
echo -e "     ${BLUE}git tag -a v${VERSION} -m 'Version ${VERSION}'${NC}"
echo -e "     ${BLUE}git push origin v${VERSION}${NC}"
echo ""

# Optional: Clean up temporary directory
read -p "$(echo -e ${YELLOW}🗑️  Clean up temporary files? [y/N]:${NC} )" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    rm -rf release/wp-trac-triager
    echo -e "${GREEN}✅ Cleanup complete! ZIP file preserved at release/${ZIP_NAME}${NC}"
else
    echo -e "${YELLOW}⏭️  Skipped cleanup. Directory preserved at release/wp-trac-triager/${NC}"
fi

echo ""
echo -e "${GREEN}🎉 All done! Ready to publish.${NC}"
