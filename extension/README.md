# Socio.io Connection Tester Extension

This Chrome extension allows you to test the connection to your Socio.io backend API.

## Features

- Test basic connectivity to the backend server
- Test individual API endpoints:
  - Ping endpoint (`/ping`)
  - Status endpoint (`/api/status`)
  - Text analysis endpoint (`/analyze_text`)
  - Image analysis endpoint (`/analyze_image`)
- Save your backend URL for future use
- View detailed response data from each endpoint

## Installation

### Loading the extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" by toggling the switch in the top right corner
3. Click "Load unpacked" and select the `extension` folder
4. The extension should now be installed and visible in your Chrome toolbar

### Using the standalone connection test page

If you don't want to install the extension, you can use the standalone connection test page:

1. Open the `connection_test.html` file in your browser
2. Enter your backend URL and test the connection

## Usage

1. Click on the Socio.io extension icon in your Chrome toolbar
2. Enter your backend URL (e.g., `https://your-backend-url.onrender.com`)
3. Click "Save" to store the URL
4. Use the test buttons to check each endpoint:
   - "Test Ping" - Tests basic connectivity
   - "Test Status" - Tests the status endpoint
   - "Test Text Analysis" - Tests text content analysis
   - "Test Image Analysis" - Tests image content analysis

## Troubleshooting

If you encounter connection issues:

1. Make sure your backend server is running
2. Check that the URL is correct and includes the protocol (https:// or http://)
3. Verify that your backend server has CORS enabled for your extension
4. Check the browser console for any error messages

## Icons

Before using the extension, you need to add icon files to the `images` folder:
- `icon16.png` (16x16 pixels)
- `icon48.png` (48x48 pixels)
- `icon128.png` (128x128 pixels)

You can create these icons using any image editor or icon generator.