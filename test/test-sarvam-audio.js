/**
 * Test SARVAM STT with audio file
 * Usage: node test/test-sarvam-audio.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const audioFilePath = 'test/sample_add_listing.m4a';

console.log('🧪 Testing SARVAM STT API with audio file...\n');

if (!fs.existsSync(audioFilePath)) {
  console.error('❌ Audio file not found:', audioFilePath);
  process.exit(1);
}

const audioBuffer = fs.readFileSync(audioFilePath);
console.log('✅ Audio file loaded');
console.log(`📁 File: ${audioFilePath}`);
console.log(`🎵 Size: ${(audioBuffer.length / 1024).toFixed(2)} KB\n`);

// Create multipart form data manually
const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
const formData = [];

// Add file field
formData.push(`--${boundary}\r\n`);
formData.push(`Content-Disposition: form-data; name="file"; filename="audio.m4a"\r\n`);
formData.push(`Content-Type: audio/mp4\r\n\r\n`);
formData.push(audioBuffer);
formData.push('\r\n');

// Add language_code field
formData.push(`--${boundary}\r\n`);
formData.push(`Content-Disposition: form-data; name="language_code"\r\n\r\n`);
formData.push('hi-IN\r\n');

// Add model field
formData.push(`--${boundary}\r\n`);
formData.push(`Content-Disposition: form-data; name="model"\r\n\r\n`);
formData.push('saaras:v3\r\n');

formData.push(`--${boundary}--\r\n`);

// Convert to buffer
const body = Buffer.concat(
  formData.map(item => typeof item === 'string' ? Buffer.from(item) : item)
);

const options = {
  hostname: 'api.sarvam.ai',
  port: 443,
  path: '/speech-to-text',
  method: 'POST',
  headers: {
    'api-subscription-key': SARVAM_API_KEY,
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': body.length
  }
};

console.log('🎤 Sending audio to SARVAM STT...\n');

const req = https.request(options, (res) => {
  let responseBody = '';

  res.on('data', (chunk) => {
    responseBody += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(responseBody);
      
      console.log('✅ SARVAM STT Response:');
      console.log(JSON.stringify(response, null, 2));
      
      const transcription = response.transcript || response.text;
      if (transcription) {
        console.log('\n✅ Transcription successful!');
        console.log('📝 Transcribed Text:', transcription);
        
        // Save for next step
        fs.writeFileSync('test/transcription.txt', transcription);
        console.log('\n💾 Saved to test/transcription.txt');
      } else {
        console.log('\n⚠️ No transcription in response');
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Response:', responseBody);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  process.exit(1);
});

req.write(body);
req.end();
