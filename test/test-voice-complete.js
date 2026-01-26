/**
 * Complete Voice Pipeline Test
 * Tests: Audio File -> SARVAM STT -> OpenRouter Intent -> Result
 * 
 * Usage: node test-voice-complete.js <audio-file-path>
 * Example: node test-voice-complete.js test/sample_add_listing.m4a
 */

require('dotenv').config({ path: '../backend/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ANSI color codes for better output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, 'cyan');
  console.log('='.repeat(70) + '\n');
}

async function testSARVAMSTT(audioFilePath) {
  logSection('STEP 1: SARVAM Speech-to-Text');
  
  // Check API key
  if (!process.env.SARVAM_API_KEY || process.env.SARVAM_API_KEY.includes('your-')) {
    log('❌ SARVAM_API_KEY not configured in backend/.env', 'red');
    return null;
  }
  
  log('✅ SARVAM API Key found', 'green');
  log(`📍 API URL: ${process.env.SARVAM_API_URL || 'https://api.sarvam.ai'}`, 'blue');
  
  if (!fs.existsSync(audioFilePath)) {
    log(`❌ Audio file not found: ${audioFilePath}`, 'red');
    return null;
  }
  
  log(`📁 Audio file: ${audioFilePath}`, 'green');
  const audioBuffer = fs.readFileSync(audioFilePath);
  const filename = path.basename(audioFilePath);
  
  // Determine content type
  const ext = path.extname(audioFilePath).toLowerCase();
  const contentTypes = {
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.m4a': 'audio/mp4',
    '.ogg': 'audio/ogg',
    '.webm': 'audio/webm'
  };
  const contentType = contentTypes[ext] || 'audio/wav';
  
  log(`🎵 File size: ${(audioBuffer.length / 1024).toFixed(2)} KB`, 'blue');
  log(`🎵 Content type: ${contentType}`, 'blue');
  
  try {
    log('\n🎤 Sending audio to SARVAM STT API...', 'yellow');
    
    const FormData = require('form-data');
    const formData = new FormData();
    
    formData.append('file', audioBuffer, {
      filename: filename,
      contentType: contentType
    });
    formData.append('language_code', 'hi');
    formData.append('model', 'saaras:v1');
    
    const response = await axios.post(
      `${process.env.SARVAM_API_URL || 'https://api.sarvam.ai'}/speech-to-text`,
      formData,
      {
        headers: {
          'api-subscription-key': process.env.SARVAM_API_KEY,
          ...formData.getHeaders()
        },
        timeout: 30000
      }
    );
    
    log('✅ SARVAM Response received', 'green');
    console.log(JSON.stringify(response.data, null, 2));
    
    const transcription = response.data.transcript || response.data.text;
    if (transcription) {
      log(`\n✅ Transcription successful!`, 'green');
      log(`📝 Transcribed Text: ${transcription}`, 'bright');
      return transcription;
    } else {
      log('\n⚠️ No transcription in response', 'yellow');
      return null;
    }
    
  } catch (error) {
    log('\n❌ SARVAM STT Error:', 'red');
    log(`Message: ${error.message}`, 'red');
    
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      console.log(JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

async function testOpenRouterIntent(transcribedText) {
  logSection('STEP 2: OpenRouter Intent Extraction');
  
  // Check API key
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
    log('❌ OPENROUTER_API_KEY not configured in backend/.env', 'red');
    return null;
  }
  
  log('✅ OpenRouter API Key found', 'green');
  log(`📍 API URL: ${process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'}`, 'blue');
  log(`🤖 Model: ${process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct'}`, 'blue');
  log(`\n📝 Query: "${transcribedText}"`, 'bright');
  
  try {
    log('\n🤖 Sending to OpenRouter for intent extraction...', 'yellow');
    
    const response = await axios.post(
      `${process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant for an agricultural marketplace. Extract intent and parameters from user queries in any Indian language.

Possible intents:
- price_query: User wants to know crop prices
- create_listing: User wants to sell/list a product
- make_offer: User wants to make an offer on a listing
- search_listings: User wants to search/buy products
- general_help: General questions

Extract these parameters if mentioned:
- cropType: Name of the crop (wheat, rice, tomato, onion, potato, cotton, etc.)
- quantity: Amount with unit (e.g., "100 kg")
- price: Price mentioned (number only)
- location: Place name
- qualityTier: premium, standard, or basic

Respond ONLY with valid JSON in this exact format:
{
  "intent": "<intent_type>",
  "cropType": "<crop_name or null>",
  "quantity": "<quantity or null>",
  "price": "<price or null>",
  "location": "<location or null>",
  "qualityTier": "<tier or null>",
  "confidence": "<high/medium/low>"
}`
          },
          {
            role: 'user',
            content: transcribedText
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
          'X-Title': 'Multilingual Mandi Test'
        },
        timeout: 15000
      }
    );
    
    const content = response.data.choices[0].message.content;
    log('✅ OpenRouter Response received', 'green');
    console.log(content);
    
    try {
      const parsed = JSON.parse(content);
      log('\n✅ Intent Extracted Successfully!', 'green');
      log(`  🎯 Intent: ${parsed.intent}`, 'bright');
      log(`  🌾 Crop: ${parsed.cropType || 'N/A'}`, 'blue');
      log(`  📦 Quantity: ${parsed.quantity || 'N/A'}`, 'blue');
      log(`  💰 Price: ${parsed.price || 'N/A'}`, 'blue');
      log(`  📍 Location: ${parsed.location || 'N/A'}`, 'blue');
      log(`  ⭐ Quality: ${parsed.qualityTier || 'N/A'}`, 'blue');
      log(`  🎲 Confidence: ${parsed.confidence || 'N/A'}`, 'blue');
      return parsed;
    } catch (parseError) {
      log('⚠️ Response is not valid JSON', 'yellow');
      return null;
    }
    
  } catch (error) {
    log('\n❌ OpenRouter Error:', 'red');
    log(`Message: ${error.message}`, 'red');
    
    if (error.response) {
      log(`Status: ${error.response.status}`, 'red');
      console.log(JSON.stringify(error.response.data, null, 2));
    }
    
    return null;
  }
}

// Main execution
(async () => {
  const audioFilePath = process.argv[2];
  
  if (!audioFilePath) {
    log('❌ No audio file provided', 'red');
    log('\n💡 Usage: node test-voice-complete.js <audio-file-path>', 'yellow');
    log('💡 Example: node test-voice-complete.js test/sample_add_listing.m4a', 'yellow');
    process.exit(1);
  }
  
  log('🎙️ VOICE PIPELINE TEST', 'cyan');
  log('Audio -> SARVAM STT -> OpenRouter Intent -> Result\n', 'blue');
  
  // Step 1: Transcribe audio
  const transcription = await testSARVAMSTT(audioFilePath);
  
  if (!transcription) {
    log('\n❌ Pipeline failed at SARVAM STT step', 'red');
    process.exit(1);
  }
  
  // Step 2: Extract intent
  const intent = await testOpenRouterIntent(transcription);
  
  if (!intent) {
    log('\n❌ Pipeline failed at OpenRouter step', 'red');
    process.exit(1);
  }
  
  // Success summary
  logSection('✅ PIPELINE TEST COMPLETE');
  log('Voice input successfully processed through entire pipeline:', 'green');
  log(`  1. Audio transcribed: "${transcription}"`, 'blue');
  log(`  2. Intent extracted: ${intent.intent}`, 'blue');
  log(`  3. Parameters parsed: ${JSON.stringify(intent, null, 2)}`, 'blue');
  
  log('\n📋 Next Steps:', 'cyan');
  log('  - Test with Kisaan Bot UI component', 'blue');
  log('  - Verify intent handling in frontend', 'blue');
  log('  - Test with different audio samples', 'blue');
  
})();
