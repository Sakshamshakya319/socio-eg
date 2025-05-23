#!/bin/bash

# One-step script to deploy to Render
# This script prepares and deploys the backend to Render

echo "=== DEPLOYING TO RENDER ==="

# Run the Render deployment preparation script
echo "Running Render deployment preparation script..."
bash render-deploy.sh

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit for Render deployment"
fi

# Instructions for manual deployment
echo ""
echo "=== NEXT STEPS ==="
echo "Your backend is now ready for deployment to Render."
echo ""
echo "To deploy:"
echo "1. Create a new repository on GitHub/GitLab"
echo "2. Add your remote repository:"
echo "   git remote add origin YOUR_REPOSITORY_URL"
echo "3. Push your code:"
echo "   git push -u origin main"
echo "4. Go to https://dashboard.render.com/new/web-service"
echo "5. Connect your repository"
echo "6. Render will automatically detect the render.yaml configuration"
echo "7. Add your Google Cloud credentials as a secret file:"
echo "   - Path: /etc/secrets/google-credentials/google-credentials.json"
echo "   - Content: Paste the entire content of your credentials file"
echo ""
echo "For more details, see RENDER_DEPLOYMENT_INSTRUCTIONS.md"