#!/bin/bash

# Simple deployment script for Render
# This script prepares and deploys the backend to Render

echo "=== DEPLOYING TO RENDER ==="

# Run the preparation script
echo "Running preparation script..."
bash prepare_for_render.sh

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit for Render deployment"
fi

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
  echo "Render CLI not found. Please install it or deploy manually through the Render dashboard."
  echo "Visit: https://render.com/docs/cli"
  exit 1
fi

# Deploy using Render CLI
echo "Deploying to Render..."
render deploy

echo "Deployment process completed!"