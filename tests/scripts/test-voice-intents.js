/**
 * Comprehensive Voice Intent Testing
 * Tests different voice queries and verifies API execution
 * 
 * Run: node test/test-voice-intents.js
 */

const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3-vl-32b-instruct';

// Test queries in different languages
const testQueries = [
  {
    name: 'Create Listing (Hindi)',
    text: 'हेलो टमाटर दस रुपये के दे दो',
    expectedIntent: 'create_listing',
    expectedParams: { cropType: 'टमाटर', price: '10' },
    apiToCheck: '/api/listings',
    method: 'POST'
  },
  {
    name: 'Create Listing (English)',
    text: 'I want to sell 100 kg wheat at 25 rupees per kg',
    expectedIntent: 'create_listing',
    expectedParams: { cropType: 'wheat', quantity: '100', price: '25' },
    apiToCheck: '/api/listings',
    method: 'POST'
  },
  {
    name: 'Price Query (Hindi)',
    text: 'टमाटर का भाव क्या है',
    expectedIntent: 'price_query',
    expectedParams: { cropType: 'टमाटर' },
    apiToCheck: '/api/prices/current',
    method: 'GET'
  },
  {
    name: 'Search Listings (English)',
    text: 'Show me onions in Delhi',
    expectedIntent: 'search_listings',
    expectedParams: { cropType: 'onion', location: 'Delhi' },
    apiToCheck: '/api/listings/search',
    method: 'GET'
  },
  {
    name: 'Make Offer (Hindi)',
    text: 'मैं गेहूं के लिए 20 रुपये देना चाहता हूं',
    expectedIntent: 'make_offer',
    expectedParams: { cropType: 'गेहूं', price: '20' },
    apiToCheck: '/api/negotiations',
    method: 'POST'
  }
];

// Login first to get token
async function login() {
  console.log('🔐 Logging in...\n');
  
  try {
    // Send OTP
    const otpResponse = await axios.post(`${API_URL}/auth/send-otp`, {
      phoneNumber: '+919876543210'
    });
    
    const otp = otpResponse.data.otp;
    console.log('✅ OTP received:', otp);
    
    // Verify OTP
    const verifyResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
      phoneNumber: '+919876543210',
      otp: otp
    });
    
    const token = verifyResponse.data.token;
    console.log('✅ Token received:', token.substring(0, 20) + '...\n');
    
    return token;
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    throw error;
  }
}

// Parse intent using OpenRouter
async function parseIntent(text) {
  console.log(`📤 Parsing intent for: "${text}"`);
  
  const systemPrompt = `You are an AI assistant for an agricultural marketplace. Extract intent and parameters from user queries in any Indian language.

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
}`;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Multilingual Mandi Test'
        },
        timeout: 30000
      }
    );

    const content = response.data.choices[0].message.content;
    console.log('📥 Raw response:', content);
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    console.log('✅ Parsed intent:', JSON.stringify(parsed, null, 2));
    
    return parsed;
  } catch (error) {
    console.error('❌ Intent parsing failed:', error.message);
    throw error;
  }
}

// Execute action based on intent
async function executeAction(intent, token) {
  console.log(`\n🚀 Executing action for intent: ${intent.intent}`);
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  try {
    switch (intent.intent) {
      case 'create_listing':
        console.log('📦 Creating listing...');
        const listingData = {
          cropType: intent.cropType || 'Tomato',
          quantity: parseInt(intent.quantity) || 10,
          unit: 'Kg',
          basePrice: parseInt(intent.price) || 10,
          qualityTier: intent.qualityTier || 'standard',
          description: `Fresh ${intent.cropType || 'produce'} from local farm`,
          locationAddress: intent.location || 'Delhi',
          images: []
        };
        
        console.log('📤 Sending:', JSON.stringify(listingData, null, 2));
        
        const createResponse = await axios.post(
          `${API_URL}/listings`,
          listingData,
          { headers }
        );
        
        console.log('✅ Listing created:', createResponse.data.listing.id);
        console.log('   Crop:', createResponse.data.listing.cropType);
        console.log('   Price:', createResponse.data.listing.finalPrice);
        
        // Verify listing exists
        const verifyResponse = await axios.get(
          `${API_URL}/listings/${createResponse.data.listing.id}`,
          { headers }
        );
        
        console.log('✅ Listing verified in database');
        return { success: true, data: createResponse.data };
        
      case 'price_query':
        console.log('💰 Querying price...');
        const priceResponse = await axios.get(
          `${API_URL}/prices/current?cropType=${intent.cropType || 'Wheat'}&location=${intent.location || 'Delhi'}`,
          { headers }
        );
        
        console.log('✅ Price retrieved:', priceResponse.data.modalPrice);
        return { success: true, data: priceResponse.data };
        
      case 'search_listings':
        console.log('🔍 Searching listings...');
        const searchResponse = await axios.get(
          `${API_URL}/listings/search?cropType=${intent.cropType || ''}&location=${intent.location || ''}`,
          { headers }
        );
        
        console.log('✅ Found listings:', searchResponse.data.count);
        return { success: true, data: searchResponse.data };
        
      case 'make_offer':
        console.log('💬 Making offer...');
        // First find a listing
        const listingsResponse = await axios.get(
          `${API_URL}/listings/search?cropType=${intent.cropType || ''}`,
          { headers }
        );
        
        if (listingsResponse.data.listings.length === 0) {
          console.log('⚠️  No listings found to make offer on');
          return { success: false, message: 'No listings found' };
        }
        
        const listing = listingsResponse.data.listings[0];
        console.log('📋 Found listing:', listing.id);
        
        // Create negotiation
        const offerResponse = await axios.post(
          `${API_URL}/negotiations`,
          {
            listingId: listing.id,
            offerPrice: parseInt(intent.price) || listing.finalPrice * 0.9
          },
          { headers }
        );
        
        console.log('✅ Offer created:', offerResponse.data.negotiation.id);
        return { success: true, data: offerResponse.data };
        
      default:
        console.log('⚠️  Unknown intent, no action taken');
        return { success: false, message: 'Unknown intent' };
    }
  } catch (error) {
    console.error('❌ Action execution failed:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting Voice Intent Tests\n');
  console.log('=' .repeat(60));
  console.log('\n');
  
  try {
    // Login
    const token = await login();
    
    // Test each query
    for (const test of testQueries) {
      console.log('=' .repeat(60));
      console.log(`\n🧪 TEST: ${test.name}`);
      console.log('=' .repeat(60));
      console.log(`Query: "${test.text}"\n`);
      
      try {
        // Parse intent
        const intent = await parseIntent(test.text);
        
        // Verify intent matches expected
        if (intent.intent !== test.expectedIntent) {
          console.log(`⚠️  Intent mismatch! Expected: ${test.expectedIntent}, Got: ${intent.intent}`);
        } else {
          console.log(`✅ Intent matches: ${intent.intent}`);
        }
        
        // Verify parameters
        for (const [key, value] of Object.entries(test.expectedParams)) {
          if (intent[key]) {
            console.log(`✅ Parameter ${key}: ${intent[key]}`);
          } else {
            console.log(`⚠️  Missing parameter: ${key}`);
          }
        }
        
        // Execute action
        const result = await executeAction(intent, token);
        
        if (result.success) {
          console.log(`\n✅ TEST PASSED: ${test.name}\n`);
        } else {
          console.log(`\n❌ TEST FAILED: ${test.name}`);
          console.log(`   Reason: ${result.message || result.error}\n`);
        }
        
      } catch (error) {
        console.log(`\n❌ TEST ERROR: ${test.name}`);
        console.log(`   Error: ${error.message}\n`);
      }
      
      // Wait between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('=' .repeat(60));
    console.log('\n✅ All tests completed!\n');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run tests
runTests();
