/**
 * Prepare for Render Deployment
 * 
 * This script helps prepare your backend for deployment to Render by:
 * 1. Checking if all required files exist
 * 2. Validating your Google Cloud credentials
 * 3. Encoding your credentials for Render deployment
 * 4. Creating necessary directories
 * 
 * Usage:
 * node prepare_for_render.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Set up simple logging
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌ ERROR' : type === 'success' ? '✅ SUCCESS' : 'ℹ️ INFO';
  console.log(`[${timestamp}] ${prefix}: ${message}`);
}

// Check if a file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

// Create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      log(`Created directory: ${dirPath}`, 'success');
      return true;
    } catch (err) {
      log(`Failed to create directory ${dirPath}: ${err.message}`, 'error');
      return false;
    }
  }
  log(`Directory already exists: ${dirPath}`);
  return true;
}

// Check required files
function checkRequiredFiles() {
  log('Checking required files...');
  
  const requiredFiles = [
    'app.js',
    'index.js',
    'package.json',
    'text_analysis.js',
    'image_content_filter.js',
    '.env',
    'my-project-92814-457204-04288ea99d5d.json'
  ];
  
  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (fileExists(file)) {
      log(`Found required file: ${file}`, 'success');
    } else {
      log(`Missing required file: ${file}`, 'error');
      allFilesExist = false;
    }
  }
  
  return allFilesExist;
}

// Validate Google Cloud credentials
function validateCredentials() {
  log('Validating Google Cloud credentials...');
  
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (!credentialsPath) {
    log('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set', 'error');
    log('Please set this variable in your .env file');
    return false;
  }
  
  log(`Looking for credentials at: ${credentialsPath}`);
  
  if (!fileExists(credentialsPath)) {
    log(`Credentials file not found at ${credentialsPath}`, 'error');
    return false;
  }
  
  try {
    const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
    const credentials = JSON.parse(credentialsContent);
    
    log('Credentials file is valid JSON', 'success');
    
    // Check required fields
    const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !credentials[field]);
    
    if (missingFields.length > 0) {
      log(`Credentials file is missing required fields: ${missingFields.join(', ')}`, 'error');
      return false;
    }
    
    log('Credentials file contains all required fields', 'success');
    log(`Project ID: ${credentials.project_id}`);
    log(`Client Email: ${credentials.client_email}`);
    
    return true;
  } catch (err) {
    log(`Error validating credentials: ${err.message}`, 'error');
    return false;
  }
}

// Encode credentials for Render
function encodeCredentials() {
  log('Encoding credentials for Render deployment...');
  
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  try {
    const credentials = fs.readFileSync(credentialsPath, 'utf8');
    const base64Credentials = Buffer.from(credentials).toString('base64');
    
    log('Credentials encoded successfully', 'success');
    
    // Save to a file for easy copying
    const encodedPath = 'encoded_credentials.txt';
    fs.writeFileSync(encodedPath, base64Credentials);
    
    log(`Encoded credentials saved to ${encodedPath}`, 'success');
    log('Copy this encoded string to use in your Render environment variables');
    
    return true;
  } catch (err) {
    log(`Error encoding credentials: ${err.message}`, 'error');
    return false;
  }
}

// Create necessary directories
function createDirectories() {
  log('Creating necessary directories...');
  
  const directories = [
    'logs',
    'uploads',
    'credentials'
  ];
  
  let allDirsCreated = true;
  
  for (const dir of directories) {
    if (!ensureDirectoryExists(dir)) {
      allDirsCreated = false;
    }
  }
  
  return allDirsCreated;
}

// Main function
async function main() {
  log('=== PREPARING FOR RENDER DEPLOYMENT ===');
  
  const filesOk = checkRequiredFiles();
  if (!filesOk) {
    log('Some required files are missing. Please fix before deploying.', 'error');
  }
  
  const credsOk = validateCredentials();
  if (!credsOk) {
    log('Google Cloud credentials validation failed. Please fix before deploying.', 'error');
  }
  
  const dirsOk = createDirectories();
  if (!dirsOk) {
    log('Failed to create some directories. Please check permissions.', 'error');
  }
  
  const encodingOk = encodeCredentials();
  if (!encodingOk) {
    log('Failed to encode credentials. Please check the credentials file.', 'error');
  }
  
  if (filesOk && credsOk && dirsOk && encodingOk) {
    log('All checks passed! Your backend is ready for deployment to Render.', 'success');
    log('\n=== DEPLOYMENT INSTRUCTIONS ===');
    log('1. Push your code to a Git repository (GitHub, GitLab, etc.)');
    log('2. Sign up for Render at https://render.com/');
    log('3. Create a new Web Service and connect your repository');
    log('4. Configure the service:');
    log('   - Name: socio-io-backend (or your preferred name)');
    log('   - Environment: Node');
    log('   - Build Command: npm install');
    log('   - Start Command: npm start');
    log('5. Add environment variables:');
    log('   - NODE_ENV: production');
    log('   - PORT: 10000');
    log('   - GOOGLE_CLOUD_PROJECT: my-project-92814-457204');
    log('   - VERTEX_AI_LOCATION: us-central1');
    log('   - VERTEX_AI_MODEL: gemini-1.5-flash-001');
    log('6. Add Secret Files:');
    log('   - Path: /etc/secrets/google-credentials/google-credentials.json');
    log('   - Content: Paste the entire content of your original JSON credentials file');
    log('7. Add this environment variable:');
    log('   - GOOGLE_APPLICATION_CREDENTIALS=/etc/secrets/google-credentials/google-credentials.json');
    log('8. Deploy your service');
  } else {
    log('Some checks failed. Please fix the issues before deploying.', 'error');
  }
}

// Run the main function
main().catch(err => {
  log(`Unexpected error: ${err.message}`, 'error');
  process.exit(1);
});