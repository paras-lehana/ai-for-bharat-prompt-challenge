/**
 * Generate PWA Icons Script
 * 
 * This script creates PNG icons from SVG for PWA manifest
 * Run with: node generate-pwa-icons.js
 */

const fs = require('fs');
const path = require('path');

// Simple icon generation using Canvas (if available) or instructions for manual conversion
console.log('PWA Icon Generation Instructions');
console.log('=================================\n');

console.log('The PWA manifest requires PNG icons. You have two options:\n');

console.log('Option 1: Use an online converter');
console.log('1. Visit https://cloudconvert.com/svg-to-png');
console.log('2. Upload public/pwa-192x192.svg and convert to PNG (192x192)');
console.log('3. Upload public/pwa-512x512.svg and convert to PNG (512x512)');
console.log('4. Upload public/apple-touch-icon.svg and convert to PNG (180x180)');
console.log('5. Save the PNG files in the public/ directory\n');

console.log('Option 2: Use ImageMagick (if installed)');
console.log('Run these commands from the frontend directory:');
console.log('  convert public/pwa-192x192.svg -resize 192x192 public/pwa-192x192.png');
console.log('  convert public/pwa-512x512.svg -resize 512x512 public/pwa-512x512.png');
console.log('  convert public/apple-touch-icon.svg -resize 180x180 public/apple-touch-icon.png\n');

console.log('Option 3: Create simple colored icons programmatically');
console.log('Creating fallback colored PNG icons...\n');

// Create a simple HTML file that can generate the icons
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>PWA Icon Generator</title>
</head>
<body>
    <h1>PWA Icon Generator</h1>
    <p>This page will generate PNG icons for your PWA.</p>
    <canvas id="canvas192" width="192" height="192"></canvas>
    <canvas id="canvas512" width="512" height="512"></canvas>
    <canvas id="canvasApple" width="180" height="180"></canvas>
    
    <div id="downloads"></div>
    
    <script>
        function createIcon(canvasId, size, filename) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            
            // Green gradient background
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#059669');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // White circle
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/3, 0, Math.PI * 2);
            ctx.fill();
            
            // Green "LM" text
            ctx.fillStyle = '#10b981';
            ctx.font = 'bold ' + (size/4) + 'px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('LM', size/2, size/2);
            
            // Create download link
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.textContent = 'Download ' + filename;
                a.style.display = 'block';
                a.style.margin = '10px';
                document.getElementById('downloads').appendChild(a);
            });
        }
        
        createIcon('canvas192', 192, 'pwa-192x192.png');
        createIcon('canvas512', 512, 'pwa-512x512.png');
        createIcon('canvasApple', 180, 'apple-touch-icon.png');
    </script>
</body>
</html>`;

const htmlPath = path.join(__dirname, 'public', 'generate-icons.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('✓ Created generate-icons.html in public/ directory');
console.log('✓ Open public/generate-icons.html in a browser to download PNG icons');
console.log('✓ Save the downloaded PNG files in the public/ directory\n');

console.log('After generating icons, the PWA will be fully functional!');
