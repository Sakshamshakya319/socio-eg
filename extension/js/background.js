// Background script for Socio.io Connection Tester

// Listen for installation
chrome.runtime.onInstalled.addListener(function() {
  console.log('Socio.io Connection Tester extension installed');
  
  // Initialize default settings
  chrome.storage.local.get(['backendUrl'], function(result) {
    if (!result.backendUrl) {
      chrome.storage.local.set({backendUrl: ''});
    }
  });
});

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'testConnection') {
    testBackendConnection(request.url)
      .then(result => sendResponse({success: true, data: result}))
      .catch(error => sendResponse({success: false, error: error.message}));
    return true; // Required for async sendResponse
  }
});

// Function to test backend connection
async function testBackendConnection(url) {
  try {
    const response = await fetch(`${url}/ping`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
}