/**
 * Test OpenRouter with SARVAM transcription
 * Usage: node test/test-openrouter-transcription.js
 */

const https = require('https');
const fs = require('fs');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

console.log('🧪 Testing OpenRouter with SARVAM transcription...\n');

// Read transcription
const transcription = fs.readFileSync('test/transcription.txt', 'utf8').trim();
console.log('📝 Transcription:', transcription);
console.log('\n🤖 Sending to OpenRouter for intent extraction...\n');

const data = JSON.stringify({
  model: 'qwen/qwen3-vl-32b-instruct',
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
      content: transcription
    }
  ],
  temperature: 0.3,
  max_tokens: 200
});

const options = {
  hostname: 'openrouter.ai',
  port: 443,
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'HTTP-Referer': 'http://localhost:3000',
    'X-Title': 'Multilingual Mandi Test'
  }
};

const req = https.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      
      if (response.error) {
        console.error('❌ OpenRouter Error:', response.error);
        return;
      }

      const content = response.choices[0].message.content;
      console.log('✅ OpenRouter Response:');
      console.log(content);
      
      try {
        const parsed = JSON.parse(content);
        console.log('\n✅ Intent Extracted Successfully!');
        console.log(`  🎯 Intent: ${parsed.intent}`);
        console.log(`  🌾 Crop: ${parsed.cropType || 'N/A'}`);
        console.log(`  📦 Quantity: ${parsed.quantity || 'N/A'}`);
        console.log(`  💰 Price: ${parsed.price || 'N/A'}`);
        console.log(`  📍 Location: ${parsed.location || 'N/A'}`);
        console.log(`  ⭐ Quality: ${parsed.qualityTier || 'N/A'}`);
        console.log(`  🎲 Confidence: ${parsed.confidence || 'N/A'}`);
        
        // Save for next step
        fs.writeFileSync('test/intent.json', JSON.stringify(parsed, null, 2));
        console.log('\n💾 Saved to test/intent.json');
      } catch (parseError) {
        console.log('⚠️ Response is not valid JSON');
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  process.exit(1);
});

req.write(data);
req.end();
