/**
 * Test OpenRouter AI
 * Run: node test-openrouter.js
 */

const axios = require('axios');
require('dotenv').config();

async function testOpenRouter() {
  console.log('🤖 Testing OpenRouter AI...\n');

  const API_KEY = process.env.OPENROUTER_API_KEY;
  const MODEL = process.env.OPENROUTER_MODEL || 'qwen/qwen3-vl-32b-instruct';
  const API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';

  if (!API_KEY || API_KEY.includes('your-')) {
    console.error('❌ OPENROUTER_API_KEY not configured in .env file');
    return;
  }

  console.log('✅ API Key found:', API_KEY.substring(0, 15) + '...');
  console.log('🤖 Model:', MODEL);
  console.log('📡 API URL:', API_URL);
  console.log('');

  try {
    console.log('📤 Sending test request...');
    console.log('Test: Generate listing description for Tomato\n');
    
    const response = await axios.post(
      `${API_URL}/chat/completions`,
      {
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: 'Generate a 2-sentence product description for 100 kg of premium quality Tomato from Delhi for an agricultural marketplace.'
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Multilingual Mandi'
        },
        timeout: 30000
      }
    );

    console.log('✅ Success! Response:');
    console.log('Generated text:', response.data.choices[0].message.content);
    console.log('');
    console.log('Full response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testOpenRouter();
