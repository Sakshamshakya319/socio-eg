require('dotenv').config();
const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI with project and location
const projectId = process.env.PROJECT_ID;
const location = process.env.LOCATION;
const modelName = process.env.TEXT_MODEL_NAME || 'text-bison';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: projectId,
  location: location,
});

// Get the text model
const generativeModel = vertexAI.preview.getGenerativeModel({
  model: modelName,
  generation_config: {
    max_output_tokens: parseInt(process.env.MAX_OUTPUT_TOKENS || '256'),
    temperature: parseFloat(process.env.TEMPERATURE || '0'),
    top_p: parseFloat(process.env.TOP_P || '0.8'),
    top_k: parseInt(process.env.TOP_K || '40'),
  },
});

// Create a list of common explicit words to check against
const explicitWords = [
  'explicit1', 'explicit2', 'explicit3', 'explicit4', 'explicit5',
  // Add more explicit words here
];

/**
 * Analyze text content using both predefined list and Vertex AI
 * @param {string} text - The text content to analyze
 * @returns {Object} - The analysis result
 */
async function analyzeText(text) {
  try {
    // First check with predefined list for performance
    const quickResult = analyzeWithPredefinedList(text);
    
    // If already found explicit content, return the result
    if (quickResult.containsExplicitContent) {
      return quickResult;
    }
    
    // Otherwise, analyze with Vertex AI
    return await analyzeWithVertexAI(text);
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
}

/**
 * Analyze text with predefined list of explicit words
 * @param {string} text - The text content to analyze
 * @returns {Object} - The analysis result
 */
function analyzeWithPredefinedList(text) {
  const lowerText = text.toLowerCase();
  const foundWords = [];
  let filteredText = text;
  
  explicitWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(lowerText)) {
      foundWords.push(word);
      filteredText = filteredText.replace(regex, match => '*'.repeat(match.length));
    }
  });
  
  return {
    containsExplicitContent: foundWords.length > 0,
    foundExplicitWords: foundWords,
    filteredText: filteredText,
    originalText: text
  };
}

/**
 * Analyze text content with Vertex AI
 * @param {string} text - The text content to analyze
 * @returns {Object} - The analysis result
 */
async function analyzeWithVertexAI(text) {
  try {
    // Create a prompt for content moderation
    const prompt = `
      Task: Analyze the following text and identify any explicit, offensive, 
      or inappropriate content. Focus on detecting profanity, sexual content, 
      hate speech, violence, or other potentially harmful content.
      
      Text to analyze: "${text}"
      
      Respond with a JSON object in the following format:
      {
        "containsExplicitContent": true/false,
        "categories": ["list", "of", "detected", "categories"],
        "explicitWords": ["list", "of", "explicit", "words", "found"],
        "severity": "low/medium/high",
        "filteredText": "text with explicit words replaced by asterisks"
      }
      
      Only return the JSON object, nothing else.
    `;

    // Generate content
    const result = await generativeModel.generateContent(prompt);
    const response = await result.response;
    const responseText = response.candidates[0].content.parts[0].text;
    
    try {
      // Parse the response as JSON
      const aiAnalysis = JSON.parse(responseText);
      
      // If explicit content was found, return the filtered text
      if (aiAnalysis.containsExplicitContent) {
        return {
          containsExplicitContent: true,
          foundExplicitWords: aiAnalysis.explicitWords || [],
          categories: aiAnalysis.categories || [],
          severity: aiAnalysis.severity || 'medium',
          filteredText: aiAnalysis.filteredText || text.replace(/\b(bad|words)\b/gi, match => '*'.repeat(match.length)),
          originalText: text
        };
      }
      
      // If no explicit content was found
      return {
        containsExplicitContent: false,
        foundExplicitWords: [],
        filteredText: text,
        originalText: text
      };
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback to basic analysis if AI response parsing fails
      return analyzeWithPredefinedList(text);
    }
  } catch (error) {
    console.error('Error calling Vertex AI:', error);
    // Fallback to basic analysis if AI call fails
    return analyzeWithPredefinedList(text);
  }
}

module.exports = {
  analyzeText
};