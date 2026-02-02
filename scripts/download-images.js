/**
 * Download crop images from URLs
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imageLinks = require('./image_link.json');

const outputDir = path.join(__dirname, 'frontend', 'public', 'images', 'crops');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filepath = path.join(outputDir, filename);
    
    console.log(`Downloading ${filename}...`);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✅ Downloaded ${filename}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('📥 Downloading crop images...\n');
  
  for (const [crop, url] of Object.entries(imageLinks)) {
    try {
      const ext = url.includes('.png') ? 'png' : url.includes('.webp') ? 'webp' : 'jpg';
      await downloadImage(url, `${crop}.${ext}`);
    } catch (error) {
      console.error(`❌ Error downloading ${crop}:`, error.message);
    }
  }
  
  console.log('\n✅ All images downloaded!');
}

downloadAll();
