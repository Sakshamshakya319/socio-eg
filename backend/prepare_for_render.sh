#!/bin/bash

# Prepare for Render Deployment Script
# This script prepares the backend for deployment to Render

echo "=== PREPARING FOR RENDER DEPLOYMENT ==="

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Check for required files
echo "Checking required files..."
REQUIRED_FILES=(".env" "app.js" "index.js" "text_analysis.js" "image_content_filter.js" "package.json")
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
    # Check if it's valid JSON
    if jq . "$CREDENTIALS_PATH" > /dev/null 2>&1; then
      echo "✅ Credentials file is valid JSON"
    else
      echo "❌ Credentials file is not valid JSON"
    fi
  else
    echo "❌ Credentials file not found at $CREDENTIALS_PATH"
  fi
fi

# Run npm install to check for dependencies
echo "Checking npm dependencies..."
npm install

# Final status
if [ "$ALL_FILES_EXIST" = true ]; then
  echo "✅ All required files exist"
  echo "Your backend is ready for deployment to Render!"
  echo ""
  echo "=== DEPLOYMENT INSTRUCTIONS ==="
  echo "1. Push your code to a Git repository (GitHub, GitLab, etc.)"
  echo "2. Sign up for Render at https://render.com/"
  echo "3. Create a new Web Service and connect your repository"
  echo "4. Configure the service:"
  echo "   - Name: socio-io-backend (or your preferred name)"
  echo "   - Environment: Node"
  echo "   - Build Command: npm install"
  echo "   - Start Command: npm start"
  echo "5. Add environment variables from your .env file"
  echo "6. Add Secret Files for Google credentials"
  echo "7. Deploy your service"
else
  echo "❌ Some required files are missing. Please fix before deploying."
fi