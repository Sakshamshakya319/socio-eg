# Socio.io Backend - Render Deployment Guide

This guide provides instructions for deploying the Socio.io backend to Render.

## Prerequisites

- A GitHub or GitLab account
- A Render account (sign up at https://render.com)
- Google Cloud credentials file

## Deployment Steps

### 1. Prepare Your Backend

Run the deployment script to prepare your backend:

```bash
bash deploy.sh
```

This script will:
- Check for required files
- Create necessary directories
- Install dependencies
- Run the build script
- Initialize a git repository if needed

### 2. Create a Repository

Create a new repository on GitHub or GitLab and push your code:

```bash
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```

### 3. Deploy to Render

#### Option 1: Using Render Dashboard

1. Go to https://dashboard.render.com/new/web-service
2. Connect your GitHub/GitLab repository
3. Use the following settings:
   - Name: socio-io-backend
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `node index.js`
4. Add the environment variables from your .env file:
   - NODE_ENV: production
   - PORT: 10000
   - GOOGLE_CLOUD_PROJECT: my-project-92814-457204
   - VERTEX_AI_LOCATION: us-central1
   - VERTEX_AI_MODEL: gemini-1.5-flash-001
   - GOOGLE_APPLICATION_CREDENTIALS: /etc/secrets/google-credentials/google-credentials.json
5. Add your Google Cloud credentials as a secret file:
   - Path: /etc/secrets/google-credentials/google-credentials.json
   - Content: Paste the entire content of your credentials file

#### Option 2: Using render.yaml

If you've pushed the render.yaml file to your repository, Render will automatically use the configuration defined in it.

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check the build logs in Render dashboard
2. Make sure all required files are present
3. Verify that the build command is correct
4. Ensure your package.json has the correct scripts defined

### Runtime Errors

If your service starts but doesn't work correctly:

1. Check the logs in Render dashboard
2. Verify that all environment variables are set correctly
3. Make sure your Google Cloud credentials are properly configured
4. Check that the required directories (logs, uploads) exist

## Testing Your Deployment

After deploying, test your API endpoints:

```bash
curl https://your-render-app.onrender.com/ping
```

Should return:
```json
{"status":"ok","message":"pong"}
```