const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const images = {
    'mustard.jpg': 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=640&q=80',
    'soybean.jpg': 'https://images.unsplash.com/photo-1620027699923-38e244838612?auto=format&fit=crop&w=640&q=80',
    'sugarcane.jpg': 'https://images.unsplash.com/photo-1629853381467-3a1c8b322f98?auto=format&fit=crop&w=640&q=80',
    'cotton.jpg': 'https://images.unsplash.com/photo-1594347789433-02f8423f038f?auto=format&fit=crop&w=640&q=80'
};

const dir = path.join(__dirname, 'frontend/public/images/crops');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log('Downloading missing images...');

Object.entries(images).forEach(([filename, url]) => {
    try {
        console.log(`Downloading ${filename}...`);
        execSync(`curl -L -A "Mozilla/5.0" -o "${path.join(dir, filename)}" "${url}"`, { stdio: 'inherit' });
        
        const stats = fs.statSync(path.join(dir, filename));
        if (stats.size < 5000) {
             console.error(`⚠️ Warning: ${filename} is too small (${stats.size} bytes).`);
        } else {
             console.log(`✅ ${filename} saved (${Math.round(stats.size/1024)}KB).`);
        }
    } catch (e) {
        console.error(`❌ Failed to download ${filename}:`, e.message);
    }
});
