#!/bin/bash

# Render Deployment Script
# This script is specifically designed to prepare the backend for Render deployment

echo "=== PREPARING FOR RENDER DEPLOYMENT ==="

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads

# Check for required files
echo "Checking for core files..."
CORE_FILES=("app.js" "index.js" "package.json")
MISSING_CORE=false

for file in "${CORE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ Found core file: $file"
  else
    echo "❌ Missing core file: $file"
    MISSING_CORE=true
  fi
done

if [ "$MISSING_CORE" = true ]; then
  echo "Critical files are missing. Deployment will likely fail."
  exit 1
fi

# Create a backup .env file if none exists
if [ ! -f ".env" ]; then
  echo "Creating backup .env file for build process..."
  cat > .env << EOL
GOOGLE_CLOUD_PROJECT=my-project-92814-457204
GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/google-credentials/google-credentials.json
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-flash-001
PORT=10000
NODE_ENV=production
SKIP_VERTEX_AI=true
EOL
  echo "✅ Created backup .env file"
fi

# Create a backup index.js if the main one fails
cp index.js index.js.original
cat > render-start.js << EOL
/**
 * Render startup script
 * This script attempts to start the main app, but falls back to a backup if it fails
 */

console.log('Starting Socio.io backend...');

try {
  // Try to start the main app
  require('./index.js');
  console.log('Main application started successfully');
} catch (err) {
  console.error('Error starting main application:', err.message);
  console.log('Falling back to backup application...');
  
  try {
    // Try to use the backup file if it exists
    if (require('fs').existsSync('./index.js.bak')) {
      require('./index.js.bak');
      console.log('Backup application started successfully');
    } else {
      // Create a minimal Express server as last resort
      const express = require('express');
      const app = express();
      const PORT = process.env.PORT || 10000;
      
      app.get('/', (req, res) => {
        res.send('Socio.io Backend - Emergency Fallback Mode');
      });
      
      app.get('/ping', (req, res) => {
        res.json({ status: 'ok', message: 'pong', mode: 'emergency' });
      });
      
      app.listen(PORT, () => {
        console.log(\`Emergency server running on port \${PORT}\`);
      });
    }
  } catch (backupErr) {
    console.error('Critical failure - could not start any version of the app:', backupErr.message);
    process.exit(1);
  }
}
EOL

echo "✅ Created render-start.js fallback script"

# Update render.yaml to use the fallback script
cat > render.yaml << EOL
services:
  - type: web
    name: socio-io-backend
    env: node
    buildCommand: npm install
    startCommand: node render-start.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: GOOGLE_CLOUD_PROJECT
        value: my-project-92814-457204
      - key: VERTEX_AI_LOCATION
        value: us-central1
      - key: VERTEX_AI_MODEL
        value: gemini-1.5-flash-001
      - key: GOOGLE_APPLICATION_CREDENTIALS
        value: /etc/secrets/google-credentials/google-credentials.json
      - key: SKIP_VERTEX_AI
        value: "true"
    disk:
      name: data
      mountPath: /opt/render/project/src/logs
      sizeGB: 1
    secrets:
      - name: google-credentials
        mountPath: /etc/secrets/google-credentials
EOL

echo "✅ Updated render.yaml with fallback configuration"

# Create a README file with deployment instructions
cat > RENDER_DEPLOYMENT_INSTRUCTIONS.md << EOL
# Render Deployment Instructions

## How to Deploy

1. Push this repository to GitHub or GitLab
2. Go to https://dashboard.render.com/new/web-service
3. Connect your repository
4. Render will automatically detect the render.yaml configuration
5. Add your Google Cloud credentials as a secret file:
   - Path: /etc/secrets/google-credentials/google-credentials.json
   - Content: Paste the entire content of your credentials file

## Troubleshooting

If your deployment fails:

1. Check the build logs in Render dashboard
2. Make sure all environment variables are set correctly
3. Verify that your Google Cloud credentials are properly configured
4. Try setting SKIP_VERTEX_AI=true if you're having issues with Google Cloud

## Testing Your Deployment

After deploying, test your API endpoints:

\`\`\`bash
curl https://your-render-app.onrender.com/ping
\`\`\`

Should return:
\`\`\`json
{"status":"ok","message":"pong"}
\`\`\`
EOL

echo "✅ Created deployment instructions"

echo ""
echo "=== DEPLOYMENT PREPARATION COMPLETE ==="
echo "Your backend is now ready for deployment to Render."
echo "Follow the instructions in RENDER_DEPLOYMENT_INSTRUCTIONS.md to deploy."