#!/bin/bash

# Deployment script for Render
# This script prepares and deploys the backend to Render

echo "=== DEPLOYING TO RENDER ==="

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Check for required files
echo "Checking required files..."
REQUIRED_FILES=(".env" "app.js" "index.js" "text_analysis.js" "image_content_filter.js" "package.json" "render.yaml")
ALL_FILES_EXIST=true

for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ Found required file: $file"
  else
    echo "❌ Missing required file: $file"
    ALL_FILES_EXIST=false
  fi
done

# Check for Google Cloud credentials
echo "Checking Google Cloud credentials..."
CREDENTIALS_PATH=$(grep GOOGLE_APPLICATION_CREDENTIALS .env | cut -d '=' -f2 | tr -d '"' | tr -d ' ')

if [ -z "$CREDENTIALS_PATH" ]; then
  echo "❌ GOOGLE_APPLICATION_CREDENTIALS not set in .env file"
else
  echo "Looking for credentials at: $CREDENTIALS_PATH"
  if [ -f "$CREDENTIALS_PATH" ]; then
    echo "✅ Credentials file found"
  else
    echo "❌ Credentials file not found at $CREDENTIALS_PATH"
  fi
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Run build script
echo "Running build script..."
npm run build

# Prepare for deployment
echo "Preparing for deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit for Render deployment"
fi

# Instructions for manual deployment
echo ""
echo "=== DEPLOYMENT INSTRUCTIONS ==="
echo "Your backend is now ready for deployment to Render."
echo ""
echo "To deploy manually:"
echo "1. Create a new repository on GitHub/GitLab"
echo "2. Add your remote repository:"
echo "   git remote add origin YOUR_REPOSITORY_URL"
echo "3. Push your code:"
echo "   git push -u origin main"
echo "4. Connect this repository to Render"
echo ""
echo "To deploy using Render Dashboard:"
echo "1. Go to https://dashboard.render.com/new/web-service"
echo "2. Connect your GitHub/GitLab repository"
echo "3. Use the following settings:"
echo "   - Name: socio-io-backend"
echo "   - Environment: Node"
echo "   - Build Command: npm install && npm run build"
echo "   - Start Command: node index.js"
echo "4. Add the environment variables from your .env file"
echo "5. Add your Google Cloud credentials as a secret file"
echo "   - Path: /etc/secrets/google-credentials/google-credentials.json"
echo "   - Content: Paste the entire content of your credentials file"
echo ""
echo "Deployment preparation completed!"