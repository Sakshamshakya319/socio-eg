// Content script for Socio.io Connection Tester

// This script runs in the context of web pages
console.log('Socio.io Connection Tester content script loaded');

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'checkPage') {
    // Perform page analysis if needed
    sendResponse({success: true, message: 'Page checked'});
  }
});

// Function to send data to the backend for analysis
async function sendToBackend(endpoint, data) {
  try {
    // Get the backend URL from storage
    const result = await chrome.storage.local.get(['backendUrl']);
    const backendUrl = result.backendUrl;
    
    if (!backendUrl) {
      throw new Error('Backend URL not configured');
    }
    
    // Send the data to the backend
    const response = await fetch(`${backendUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error sending data to ${endpoint}:`, error);
    throw error;
  }
}

// Example function to analyze text on the page
async function analyzePageText() {
  try {
    const pageText = document.body.innerText.substring(0, 1000); // Limit to 1000 chars
    const pageUrl = window.location.href;
    
    const result = await sendToBackend('analyze_text', {
      text: pageText,
      url: pageUrl
    });
    
    console.log('Text analysis result:', result);
    return result;
  } catch (error) {
    console.error('Text analysis failed:', error);
    throw error;
  }
}

// Example function to analyze images on the page
async function analyzePageImages() {
  try {
    const images = Array.from(document.querySelectorAll('img'))
      .filter(img => img.src && img.src.startsWith('http'))
      .slice(0, 5); // Limit to first 5 images
    
    const pageUrl = window.location.href;
    const results = [];
    
    for (const img of images) {
      try {
        const result = await sendToBackend('analyze_image', {
          image_url: img.src,
          url: pageUrl
        });
        results.push({
          src: img.src,
          result: result
        });
      } catch (error) {
        console.error(`Error analyzing image ${img.src}:`, error);
        results.push({
          src: img.src,
          error: error.message
        });
      }
    }
    
    console.log('Image analysis results:', results);
    return results;
  } catch (error) {
    console.error('Image analysis failed:', error);
    throw error;
  }
}