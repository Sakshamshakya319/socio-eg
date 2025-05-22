/**
 * Entry point for Socio.io backend
 * This file loads the app.js file which contains the server implementation
 */

// Load environment variables
require('dotenv').config();

// Require the app file
const app = require('./app.js');

// Get port from environment variable or use default
const PORT = process.env.PORT || 10000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Google Cloud Project: ${process.env.GOOGLE_CLOUD_PROJECT || 'Not set'}`);
  console.log(`Vertex AI Location: ${process.env.VERTEX_AI_LOCATION || 'us-central1'}`);
  console.log(`Vertex AI Model: ${process.env.VERTEX_AI_MODEL || 'gemini-1.5-flash-001'}`);
});