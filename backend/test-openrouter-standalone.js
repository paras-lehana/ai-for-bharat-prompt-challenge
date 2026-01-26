/**
 * Standalone test for OpenRouter AI API
 * Run: node backend/test-openrouter-standalone.js [transcribed-text]
 * Example: node backend/test-openrouter-standalone.js "मुझे 100 किलो गेहूं बेचना है"
 */

require('dotenv').config({ path: './backend/.env' });
const axios = require('axios');

async function testOpenRouterIntent(customQuery = null) {
  console.log('🧪 Testing OpenRouter Intent Extraction...\n');
  
  // Check API key
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
    console.error('❌ OPENROUTER_API_KEY not configured in backend/.env');
    console.log('Please add: OPENROUTER_API_KEY=your-actual-key');
    return;
  }
  
  console.log('✅ API Key found');
  console.log('📍 API URL:', process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1');
  console.log('🤖 Model:', process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct');
  
  const testQueries = customQuery ? [customQuery] : [
    'टमाटर का भाव क्या है?',
    'What is the price of tomato?',
    'I want to sell 100 kg wheat',
    'मुझे प्याज खरीदना है',
    'Show me rice listings near Delhi'
  ];
  
  for (const query of testQueries) {
    console.log(`\n\n📝 Testing query: "${query}"`);
    console.log('─'.repeat(60));
    
    try {
      const response = await axios.post(
        `${process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'}/chat/completions`,
        {
          model: process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for an agricultural marketplace. Extract intent and parameters from user queries.

Possible intents:
- price_query: User wants to know crop prices
- create_listing: User wants to sell/list a product
- make_offer: User wants to make an offer on a listing
- search_listings: User wants to search/buy products
- general_help: General questions

Extract these parameters if mentioned:
- cropType: Name of the crop (wheat, rice, tomato, onion, etc.)
- quantity: Amount with unit (e.g., "100 kg")
- price: Price mentioned
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
              content: query
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
      console.log('✅ OpenRouter Response:');
      console.log(content);
      
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(content);
        console.log('\n✅ Parsed Intent:');
        console.log('  Intent:', parsed.intent);
        console.log('  Crop:', parsed.cropType || 'N/A');
        console.log('  Quantity:', parsed.quantity || 'N/A');
        console.log('  Price:', parsed.price || 'N/A');
        console.log('  Location:', parsed.location || 'N/A');
        console.log('  Confidence:', parsed.confidence || 'N/A');
      } catch (parseError) {
        console.log('⚠️ Response is not valid JSON, but got text response');
      }
      
    } catch (error) {
      console.error('\n❌ OpenRouter Error:');
      console.error('Message:', error.message);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', JSON.stringify(error.response.data, null, 2));
      }
      
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️ Request timed out');
      }
    }
  }
}

async function testOpenRouterNegotiation() {
  console.log('\n\n🧪 Testing OpenRouter Negotiation Analysis...\n');
  
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
    console.error('❌ OPENROUTER_API_KEY not configured');
    return;
  }
  
  try {
    console.log('💰 Testing negotiation scenario:');
    console.log('  Listing Price: ₹100');
    console.log('  Buyer Offer: ₹80');
    console.log('  Market Average: ₹95');
    
    const response = await axios.post(
      `${process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1'}/chat/completions`,
      {
        model: process.env.OPENROUTER_MODEL || 'qwen/qwen-2.5-72b-instruct',
        messages: [
          {
            role: 'user',
            content: `Analyze this agricultural product negotiation:
- Listing price: ₹100
- Buyer offer: ₹80
- Market average: ₹95

Provide a fair counter-offer and brief reasoning.
Respond ONLY with valid JSON: {"counterOffer": <number>, "reasoning": "<text>"}`
          }
        ],
        temperature: 0.3,
        max_tokens: 150
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
    console.log('\n✅ OpenRouter Response:');
    console.log(content);
    
    try {
      const parsed = JSON.parse(content);
      console.log('\n✅ Negotiation Analysis:');
      console.log('  Counter-Offer: ₹' + parsed.counterOffer);
      console.log('  Reasoning:', parsed.reasoning);
    } catch (parseError) {
      console.log('⚠️ Response is not valid JSON');
    }
    
  } catch (error) {
    console.error('\n❌ OpenRouter Error:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run tests
(async () => {
  // Get transcribed text from command line argument
  const transcribedText = process.argv.slice(2).join(' ');
  
  if (transcribedText) {
    console.log('🎯 Testing with provided transcription:', transcribedText);
  } else {
    console.log('💡 Usage: node backend/test-openrouter-standalone.js "<transcribed-text>"');
    console.log('💡 Example: node backend/test-openrouter-standalone.js "मुझे 100 किलो गेहूं बेचना है"\n');
    console.log('📝 Running with default test queries...\n');
  }
  
  await testOpenRouterIntent(transcribedText || null);
  
  if (!transcribedText) {
    await testOpenRouterNegotiation();
  }
  
  console.log('\n\n📋 Summary:');
  console.log('- Check if API key is valid');
  console.log('- Ensure you have credits');
  console.log('- Model should support JSON responses');
  console.log('- Check OpenRouter documentation: https://openrouter.ai/docs');
})();
