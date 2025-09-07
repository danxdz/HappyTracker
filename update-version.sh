#!/bin/bash

# HappyTracker Version Tracker
# Updates version based on commit count

# Get current commit count
COMMIT_COUNT=$(git rev-list --count HEAD)

# Calculate version based on commit count
if [ $COMMIT_COUNT -eq 1 ]; then
    VERSION="1.0.0"
elif [ $COMMIT_COUNT -lt 10 ]; then
    VERSION="1.${COMMIT_COUNT}.0"
elif [ $COMMIT_COUNT -lt 100 ]; then
    MAJOR=$((COMMIT_COUNT / 10))
    MINOR=$((COMMIT_COUNT % 10))
    VERSION="1.${MAJOR}.${MINOR}"
else
    MAJOR=$((COMMIT_COUNT / 100))
    MINOR=$(((COMMIT_COUNT % 100) / 10))
    PATCH=$((COMMIT_COUNT % 10))
    VERSION="1.${MAJOR}.${MINOR}.${PATCH}"
fi

# Update README.md with new version
sed -i "s/\*\*Version: [^*]*\*\*/\*\*Version: ${VERSION}\*\*/" README.md
sed -i "s/\*\*Commits: [^*]*\*\*/\*\*Commits: ${COMMIT_COUNT}\*\*/" README.md

# Update package.json if it exists
if [ -f "package.json" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${VERSION}\"/" package.json
fi

# Update apps/web/package.json if it exists
if [ -f "apps/web/package.json" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${VERSION}\"/" apps/web/package.json
fi

# Update apps/mobile/package.json if it exists
if [ -f "apps/mobile/package.json" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${VERSION}\"/" apps/mobile/package.json
fi

# Update apps/backend/package.json if it exists
if [ -f "apps/backend/package.json" ]; then
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"${VERSION}\"/" apps/backend/package.json
fi

echo "Version updated to ${VERSION} (Commit ${COMMIT_COUNT})"