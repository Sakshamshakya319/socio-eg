// Popup script for Socio.io Connection Tester

document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const backendUrlInput = document.getElementById('backend-url');
  const saveUrlButton = document.getElementById('save-url');
  const testPingButton = document.getElementById('test-ping');
  const testStatusButton = document.getElementById('test-status');
  const testTextAnalysisButton = document.getElementById('test-text-analysis');
  const testImageAnalysisButton = document.getElementById('test-image-analysis');
  const clearLogsButton = document.getElementById('clear-logs');
  
  const pingResult = document.getElementById('ping-result');
  const statusResult = document.getElementById('status-result');
  const textResult = document.getElementById('text-result');
  const imageResult = document.getElementById('image-result');
  const logContainer = document.getElementById('log-container');
  
  const testText = document.getElementById('test-text');
  const imageUrl = document.getElementById('image-url');
  
  // Load saved backend URL
  chrome.storage.local.get(['backendUrl'], function(result) {
    if (result.backendUrl) {
      backendUrlInput.value = result.backendUrl;
      log('Loaded saved backend URL: ' + result.backendUrl, 'info');
    }
  });
  
  // Save backend URL
  saveUrlButton.addEventListener('click', function() {
    const url = backendUrlInput.value.trim();
    if (url) {
      chrome.storage.local.set({backendUrl: url}, function() {
        log('Backend URL saved: ' + url, 'success');
      });
    } else {
      log('Please enter a valid URL', 'error');
    }
  });
  
  // Test ping endpoint
  testPingButton.addEventListener('click', function() {
    const url = backendUrlInput.value.trim();
    if (!url) {
      log('Please enter a backend URL first', 'error');
      return;
    }
    
    pingResult.className = 'result pending';
    pingResult.textContent = 'Testing...';
    
    log('Testing ping endpoint...', 'info');
    
    fetch(`${url}/ping`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        pingResult.className = 'result success';
        pingResult.textContent = `Success: ${data}`;
        log('Ping test successful: ' + data, 'success');
      })
      .catch(error => {
        pingResult.className = 'result error';
        pingResult.textContent = `Error: ${error.message}`;
        log('Ping test failed: ' + error.message, 'error');
      });
  });
  
  // Test status endpoint
  testStatusButton.addEventListener('click', function() {
    const url = backendUrlInput.value.trim();
    if (!url) {
      log('Please enter a backend URL first', 'error');
      return;
    }
    
    statusResult.className = 'result pending';
    statusResult.textContent = 'Testing...';
    
    log('Testing status endpoint...', 'info');
    
    fetch(`${url}/api/status`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        statusResult.className = 'result success';
        statusResult.textContent = JSON.stringify(data, null, 2);
        log('Status test successful', 'success');
      })
      .catch(error => {
        statusResult.className = 'result error';
        statusResult.textContent = `Error: ${error.message}`;
        log('Status test failed: ' + error.message, 'error');
      });
  });
  
  // Test text analysis endpoint
  testTextAnalysisButton.addEventListener('click', function() {
    const url = backendUrlInput.value.trim();
    const text = testText.value.trim();
    
    if (!url) {
      log('Please enter a backend URL first', 'error');
      return;
    }
    
    if (!text) {
      log('Please enter some text to analyze', 'error');
      return;
    }
    
    textResult.className = 'result pending';
    textResult.textContent = 'Analyzing...';
    
    log('Testing text analysis endpoint...', 'info');
    
    fetch(`${url}/analyze_text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        url: 'https://example.com/test'
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        textResult.className = 'result success';
        textResult.textContent = JSON.stringify(data, null, 2);
        log('Text analysis successful', 'success');
      })
      .catch(error => {
        textResult.className = 'result error';
        textResult.textContent = `Error: ${error.message}`;
        log('Text analysis failed: ' + error.message, 'error');
      });
  });
  
  // Test image analysis endpoint
  testImageAnalysisButton.addEventListener('click', function() {
    const url = backendUrlInput.value.trim();
    const imgUrl = imageUrl.value.trim();
    
    if (!url) {
      log('Please enter a backend URL first', 'error');
      return;
    }
    
    if (!imgUrl) {
      log('Please enter an image URL to analyze', 'error');
      return;
    }
    
    imageResult.className = 'result pending';
    imageResult.textContent = 'Analyzing...';
    
    log('Testing image analysis endpoint...', 'info');
    
    fetch(`${url}/analyze_image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image_url: imgUrl,
        url: 'https://example.com/test'
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        imageResult.className = 'result success';
        imageResult.textContent = JSON.stringify(data, null, 2);
        log('Image analysis successful', 'success');
      })
      .catch(error => {
        imageResult.className = 'result error';
        imageResult.textContent = `Error: ${error.message}`;
        log('Image analysis failed: ' + error.message, 'error');
      });
  });
  
  // Clear logs
  clearLogsButton.addEventListener('click', function() {
    logContainer.innerHTML = '';
    log('Logs cleared', 'info');
  });
  
  // Helper function to add log entries
  function log(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    const time = new Date().toLocaleTimeString();
    const logTime = document.createElement('span');
    logTime.className = 'log-time';
    logTime.textContent = `[${time}]`;
    
    const logMessage = document.createElement('span');
    logMessage.className = `log-${type}`;
    logMessage.textContent = ` ${message}`;
    
    logEntry.appendChild(logTime);
    logEntry.appendChild(logMessage);
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
  }
  
  // Initial log
  log('Extension loaded. Ready to test connection.', 'info');
  
  // Set default image URL
  imageUrl.value = 'https://cloud.google.com/vision/docs/images/bicycle_example.png';
  
  // Set default test text
  testText.value = 'This is a test message to analyze content filtering.';
});