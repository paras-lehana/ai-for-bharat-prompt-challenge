/**
 * Test Kisaan Bot API with audio file
 * Usage: node test/test-kisaanbot-api.js
 */

const http = require('http');
const fs = require('fs');

const BACKEND_URL = process.env.BACKEND_URL || 'localhost';
const BACKEND_PORT = process.env.BACKEND_PORT || 5000;

console.log('🧪 Testing Kisaan Bot API...\n');

// Read audio file and convert to base64
const audioFilePath = 'test/sample_add_listing.m4a';
if (!fs.existsSync(audioFilePath)) {
  console.error('❌ Audio file not found:', audioFilePath);
  process.exit(1);
}

const audioBuffer = fs.readFileSync(audioFilePath);
const audioBase64 = audioBuffer.toString('base64');

console.log('✅ Audio file loaded');
console.log(`📁 File: ${audioFilePath}`);
console.log(`🎵 Size: ${(audioBuffer.length / 1024).toFixed(2)} KB`);
console.log(`📦 Base64 length: ${audioBase64.length} characters\n`);

const data = JSON.stringify({
  audioBase64: `data:audio/mp4;base64,${audioBase64}`,
  languageCode: 'hi'
});

const options = {
  hostname: BACKEND_URL,
  port: BACKEND_PORT,
  path: '/api/voice/query',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log('🎤 Sending to Kisaan Bot API...');
console.log(`📍 URL: http://${BACKEND_URL}:${BACKEND_PORT}/api/voice/query\n`);

const req = http.request(options, (res) => {
  let body = '';

  res.on('data', (chunk) => {
    body += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      
      console.log('✅ Kisaan Bot API Response:');
      console.log(JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('\n✅ Voice Query Processed Successfully!');
        console.log(`  📝 Transcribed: ${response.transcribedText}`);
        console.log(`  🎯 Intent: ${response.analysis.intent}`);
        console.log(`  🌾 Crop: ${response.analysis.cropType || 'N/A'}`);
        console.log(`  📦 Quantity: ${response.analysis.quantity || 'N/A'}`);
        console.log(`  💰 Price: ${response.analysis.price || 'N/A'}`);
        console.log(`  💬 Response: ${response.text}`);
        console.log(`  🔊 Audio: ${response.audio ? 'Generated' : 'N/A'}`);
      } else {
        console.log('\n⚠️ Request failed:', response.error || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', error.message);
      console.error('Response:', body);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  console.error('\n💡 Make sure backend is running:');
  console.error('   docker-compose up');
  process.exit(1);
});

req.write(data);
req.end();
