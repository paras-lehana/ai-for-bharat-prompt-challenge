/**
 * Standalone test for SARVAM STT API
 * Run: node backend/test-sarvam-standalone.js [audio-file-path]
 * Example: node backend/test-sarvam-standalone.js test/sample_add_listing.m4a
 */

require('dotenv').config({ path: './backend/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function testSARVAMSTT(audioFilePath = null) {
  console.log('🧪 Testing SARVAM STT API...\n');
  
  // Check API key
  if (!process.env.SARVAM_API_KEY || process.env.SARVAM_API_KEY.includes('your-')) {
    console.error('❌ SARVAM_API_KEY not configured in backend/.env');
    console.log('Please add: SARVAM_API_KEY=your-actual-key');
    return null;
  }
  
  console.log('✅ API Key found');
  console.log('📍 API URL:', process.env.SARVAM_API_URL || 'https://api.sarvam.ai');
  
  let audioBuffer;
  let filename;
  let contentType;
  
  if (audioFilePath && fs.existsSync(audioFilePath)) {
    // Use provided audio file
    console.log('📁 Using audio file:', audioFilePath);
    audioBuffer = fs.readFileSync(audioFilePath);
    filename = path.basename(audioFilePath);
    
    // Determine content type from extension
    const ext = path.extname(audioFilePath).toLowerCase();
    const contentTypes = {
      '.wav': 'audio/wav',
      '.mp3': 'audio/mpeg',
      '.m4a': 'audio/mp4',
      '.ogg': 'audio/ogg',
      '.webm': 'audio/webm'
    };
    contentType = contentTypes[ext] || 'audio/wav';
    console.log('🎵 File size:', (audioBuffer.length / 1024).toFixed(2), 'KB');
    console.log('🎵 Content type:', contentType);
  } else {
    // Use mock audio data
    console.log('⚠️ No audio file provided or file not found, using mock data');
    const mockAudioBase64 = 'UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    audioBuffer = Buffer.from(mockAudioBase64, 'base64');
    filename = 'test-audio.wav';
    contentType = 'audio/wav';
  }
  
  try {
    console.log('\n🎤 Sending audio to SARVAM STT...');
    
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
        timeout: 30000 // Increased timeout for larger files
      }
    );
    
    console.log('✅ SARVAM STT Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
    const transcription = response.data.transcript || response.data.text;
    if (transcription) {
      console.log('\n✅ Transcription successful!');
      console.log('📝 Transcribed Text:', transcription);
      return transcription;
    } else {
      console.log('\n⚠️ No transcription in response');
      return null;
    }
    
  } catch (error) {
    console.error('\n❌ SARVAM STT Error:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ Request timed out - check your internet connection');
    }
    
    return null;
  }
}

async function testSARVAMTTS() {
  console.log('\n\n🧪 Testing SARVAM TTS API...\n');
  
  if (!process.env.SARVAM_API_KEY || process.env.SARVAM_API_KEY.includes('your-')) {
    console.error('❌ SARVAM_API_KEY not configured');
    return;
  }
  
  try {
    console.log('🔊 Sending test text to SARVAM TTS...');
    
    const response = await axios.post(
      `${process.env.SARVAM_API_URL || 'https://api.sarvam.ai'}/text-to-speech`,
      {
        inputs: ['नमस्ते, यह एक परीक्षण है'],
        target_language_code: 'hi',
        speaker: 'meera',
        pitch: 0,
        pace: 1.0,
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: 'bulbul:v1'
      },
      {
        headers: {
          'api-subscription-key': process.env.SARVAM_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );
    
    console.log('✅ SARVAM TTS Response:');
    console.log('Audio length:', response.data.audios?.[0]?.length || 0, 'characters');
    
    if (response.data.audios?.[0]) {
      console.log('\n✅ TTS successful!');
      console.log('🔊 Audio generated (base64)');
    }
    
  } catch (error) {
    console.error('\n❌ SARVAM TTS Error:');
    console.error('Message:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run tests
(async () => {
  // Get audio file path from command line argument
  const audioFilePath = process.argv[2];
  
  if (!audioFilePath) {
    console.log('💡 Usage: node backend/test-sarvam-standalone.js <audio-file-path>');
    console.log('💡 Example: node backend/test-sarvam-standalone.js test/sample_add_listing.m4a\n');
  }
  
  const transcription = await testSARVAMSTT(audioFilePath);
  await testSARVAMTTS();
  
  console.log('\n\n📋 Summary:');
  console.log('- Check if API key is valid');
  console.log('- Ensure you have credits/quota');
  console.log('- Test with real audio file for better results');
  console.log('- Check SARVAM documentation: https://docs.sarvam.ai');
  
  // Return transcription for chaining with OpenRouter test
  if (transcription) {
    console.log('\n\n🔗 To test with OpenRouter, run:');
    console.log(`node backend/test-openrouter-standalone.js "${transcription}"`);
  }
})();
