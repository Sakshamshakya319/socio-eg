# Socio.io Backend

Content moderation backend for the Socio.io browser extension.

## Deployment to Render

### Prerequisites

1. Create a [Render](https://render.com) account if you don't have one
2. Have your Google Cloud credentials JSON file ready

### Deployment Steps

1. **Create a new Web Service on Render**

   - Go to the Render Dashboard
   - Click "New" and select "Web Service"
   - Connect your GitHub repository or upload your code directly
   - Select the repository with your Socio.io backend code

2. **Configure the Web Service**

   - Name: `socio-io-backend` (or your preferred name)
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Select the appropriate plan (Free tier works for testing)

3. **Add Environment Variables**

   Add the following environment variables:

   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `GOOGLE_CLOUD_PROJECT`: `my-project-92814-457204`
   - `VERTEX_AI_LOCATION`: `us-central1`
   - `VERTEX_AI_MODEL`: `gemini-1.5-flash-001`

4. **Add Secret Files**

   - In the Render dashboard, go to your web service
   - Navigate to "Environment" tab
   - Under "Secret Files", add a new secret file
   - Path: `/etc/secrets/google-credentials/google-credentials.json`
   - Content: Paste the entire content of your Google Cloud credentials JSON file
   - Add environment variable: `GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/google-credentials/google-credentials.json`

5. **Deploy**

   - Click "Create Web Service"
   - Render will build and deploy your application

6. **Verify Deployment**

   - Once deployed, click on the URL provided by Render
   - Test the API endpoints:
     - `GET /ping` should return a "pong" response
     - `GET /api/status` should return the service status

## Manual Deployment Commands

If you prefer to deploy manually:

```bash
# Install dependencies
npm install

# Start the server
npm start
```

## Environment Variables

The following environment variables are required:

- `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud credentials JSON file
- `VERTEX_AI_LOCATION`: Google Cloud region (default: us-central1)
- `VERTEX_AI_MODEL`: Vertex AI model name (default: gemini-1.5-flash-001)
- `PORT`: Port to run the server on (default: 10000)
- `NODE_ENV`: Environment (development/production)