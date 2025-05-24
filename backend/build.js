// Simple build script for the Socio.io backend
const fs = require('fs');
const path = require('path');

console.log('Building Socio.io backend...');

// Ensure .env file exists
const envExamplePath = path.join(__dirname, '.env.example');
const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('Creating .env file from .env.example...');
  fs.copyFileSync(envExamplePath, envPath);
  console.log('Please update the .env file with your actual configuration values.');
}

// Check for Google credentials file
const credentialsPath = path.join(__dirname, 'google-credentials.json');
if (!fs.existsSync(credentialsPath)) {
  console.log('\x1b[33m%s\x1b[0m', 'WARNING: google-credentials.json file not found!');
  console.log('Please download your Google Cloud credentials JSON file from the Google Cloud Console');
  console.log('and save it as "google-credentials.json" in the backend directory.');
}

// Check dependencies
try {
  require('@google-cloud/vision');
  require('@google-cloud/vertexai');
  require('express');
  require('cors');
  require('dotenv');
  console.log('\x1b[32m%s\x1b[0m', 'All dependencies are installed.');
} catch (error) {
  console.log('\x1b[31m%s\x1b[0m', 'Missing dependencies detected.');
  console.log('Please run: npm install');
  process.exit(1);
}

console.log('\x1b[32m%s\x1b[0m', 'Build completed successfully!');
console.log('To start the server, run: npm start');