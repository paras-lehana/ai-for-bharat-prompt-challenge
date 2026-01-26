/**
 * Test SARVAM AI Speech-to-Text
 * Run: node test-sarvam-stt.js
 */

const axios = require('axios');
require('dotenv').config();

async function testSarvamSTT() {
  console.log('🎤 Testing SARVAM AI Speech-to-Text...\n');

  const API_KEY = process.env.SARVAM_API_KEY;
  const API_URL = process.env.SARVAM_API_URL || 'https://api.sarvam.ai';

  if (!API_KEY || API_KEY.includes('your-')) {
    console.error('❌ SARVAM_API_KEY not configured in .env file');
    return;
  }

  console.log('✅ API Key found:', API_KEY.substring(0, 10) + '...');
  console.log('📡 API URL:', API_URL);
  console.log('');

  // Test with mock audio (you'll need to replace with actual audio base64)
  const mockAudioBase64 = 'mock-audio-data';

  try {
    console.log('📤 Sending request to SARVAM API...');
    
    const response = await axios.post(
      `${API_URL}/speech-to-text`,
      {
        audio: mockAudioBase64,
        language: 'hi',
        model: 'saaras:v1'
      },
      {
        headers: {
          'api-subscription-key': API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log('✅ Success! Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testSarvamSTT();
