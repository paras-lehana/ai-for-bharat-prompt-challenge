/**
 * Download crop images from image_link.json
 * Run: node download-crop-images.js
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const imageLinks = require('./image_link.json');
const outputDir = path.join(__dirname, 'frontend', 'public', 'images', 'crops');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const filepath = path.join(outputDir, filename);
    
    console.log(`📥 Downloading ${filename}...`);
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded ${filename}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filename).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('🌾 Downloading crop images...\n');
  
  for (const [crop, url] of Object.entries(imageLinks)) {
    try {
      // Determine file extension from URL
      const ext = url.match(/\.(jpg|jpeg|png|webp)/i)?.[0] || '.jpg';
      const filename = `${crop}${ext}`;
      
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`❌ Error downloading ${crop}:`, error.message);
    }
  }
  
  console.log('\n✅ All downloads complete!');
  console.log(`📁 Images saved to: ${outputDir}`);
}

downloadAll();
