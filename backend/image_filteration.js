require('dotenv').config();
const vision = require('@google-cloud/vision');

// Create a client
const client = new vision.ImageAnnotatorClient();

/**
 * Analyze image content using Google Vision API
 * @param {string} imageSource - Image URL or base64 data
 * @returns {Object} - The analysis result
 */
async function analyzeImage(imageSource) {
  try {
    let request;
    
    // Determine if the image source is a URL or base64 data
    if (imageSource.startsWith('http')) {
      request = { image: { source: { imageUri: imageSource } } };
    } else {
      // Remove data:image/jpeg;base64, prefix if present
      const base64Data = imageSource.replace(/^data:image\/\w+;base64,/, '');
      request = { image: { content: base64Data } };
    }
    
    // Configure the request for safe search detection
    const [result] = await client.safeSearchDetection(request);
    const safeSearch = result.safeSearchAnnotation;
    
    if (!safeSearch) {
      return { 
        isInappropriate: false, 
        message: 'Unable to analyze image content'
      };
    }
    
    // Define threshold levels from environment variables or use defaults
    const adultThreshold = process.env.MIN_ADULT_CONTENT_LIKELIHOOD || 'POSSIBLE';
    const violenceThreshold = process.env.MIN_VIOLENCE_CONTENT_LIKELIHOOD || 'POSSIBLE';
    const medicalThreshold = process.env.MIN_MEDICAL_CONTENT_LIKELIHOOD || 'LIKELY';
    const spoofThreshold = process.env.MIN_SPOOF_CONTENT_LIKELIHOOD || 'VERY_LIKELY';
    
    // Vision API likelihood levels in order of severity
    const likelihoodOrder = [
      'UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY'
    ];
    
    // Check if any category exceeds the threshold
    const isAdultContent = likelihoodOrder.indexOf(safeSearch.adult) >= likelihoodOrder.indexOf(adultThreshold);
    const isViolent = likelihoodOrder.indexOf(safeSearch.violence) >= likelihoodOrder.indexOf(violenceThreshold);
    const isMedical = likelihoodOrder.indexOf(safeSearch.medical) >= likelihoodOrder.indexOf(medicalThreshold);
    const isSpoof = likelihoodOrder.indexOf(safeSearch.spoof) >= likelihoodOrder.indexOf(spoofThreshold);
    
    // Determine if the image is inappropriate based on thresholds
    const isInappropriate = isAdultContent || isViolent || isMedical || isSpoof;
    
    // Collect triggered categories
    const triggeredCategories = [];
    if (isAdultContent) triggeredCategories.push('adult');
    if (isViolent) triggeredCategories.push('violence');
    if (isMedical) triggeredCategories.push('medical');
    if (isSpoof) triggeredCategories.push('spoof');
    
    // Determine the message based on the analysis
    let message = 'Image is appropriate';
    if (isInappropriate) {
      message = `Image contains inappropriate content: ${triggeredCategories.join(', ')}`;
    }
    
    return {
      isInappropriate,
      message,
      safeSearch,
      triggeredCategories
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}

module.exports = {
  analyzeImage
};