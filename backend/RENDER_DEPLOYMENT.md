# Render Deployment Solutions

This document provides solutions to fix the Render deployment error: `bash: line 1: cd: backend: No such file or directory`.

## Problem

The error occurs because the render.yaml file is configured to run `cd backend && npm install`, but when you deploy the entire repository to Render, there's no "backend" directory within the deployed repository (since you're already in the backend directory).

## Solution Options

### Option 1: Deploy Only the Backend Directory (Recommended)

Create a new repository containing only the backend code:

1. Use the provided script to prepare a backend-only repository:
   ```bash
   bash prepare_backend_only_repo.sh
   ```

2. Follow the instructions to push this to a new GitHub/GitLab repository

3. Connect this repository to Render

This is the simplest solution and avoids any path confusion.

### Option 2: Use the Root-Level render.yaml

If you want to deploy the entire repository:

1. Use the render.yaml file that has been created at the root of your repository
2. This file includes the `rootDir: backend` directive to tell Render which directory to use

### Option 3: Modify Your Deployment Process

If you're using the Render CLI or API:

1. Make sure you're deploying from the correct directory
2. Use the updated render.yaml file in the backend directory that doesn't include `cd backend`

## Files Created/Modified to Help

1. `render.yaml` (root level) - Configured to use the backend subdirectory
2. `backend/render.yaml` - Updated to remove the `cd backend` commands
3. `backend/render_deploy_guide.md` - Detailed guide for deployment
4. `backend/prepare_backend_only_repo.sh` - Script to create a backend-only repository
5. `backend/prepare_for_render.sh` - Script to check if your backend is ready for deployment
6. `backend/deploy.sh` - Simple deployment script

## Important Notes

1. Make sure your Google Cloud credentials are properly set up in Render as a secret file
2. Ensure all required environment variables are set in Render
3. After deployment, check the logs for any runtime errors

## Testing Your Deployment

After deploying, test your API endpoints to ensure everything is working correctly:

```bash
curl https://your-render-app.onrender.com/ping
```

Should return:
```json
{"status":"ok","message":"pong"}
```