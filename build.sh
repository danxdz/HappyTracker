# Netlify Build Script
#!/bin/bash

echo "🚀 Building HappyTracker Web App..."

# Navigate to web app directory
cd apps/web

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building the app..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Built files are in: apps/web/dist"
else
    echo "❌ Build failed!"
    exit 1
fi