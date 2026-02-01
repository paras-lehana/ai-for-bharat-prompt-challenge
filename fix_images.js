const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Unsplash IDs for reliable high-quality images
const images = {
    'wheat.jpg': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=640&q=80',
    'rice.jpg': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=80',
    'tomato.jpg': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=640&q=80',
    'potato.jpg': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=80',
    'onion.jpg': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=640&q=80',
    'corn.jpg': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=640&q=80',
    'cotton.jpg': 'https://images.unsplash.com/photo-1594347789433-02f8423f038f?auto=format&fit=crop&w=640&q=80',
    'sugarcane.jpg': 'https://images.unsplash.com/photo-1629853381467-3a1c8b322f98?auto=format&fit=crop&w=640&q=80',
    'soybean.jpg': 'https://images.unsplash.com/photo-1620027699923-38e244838612?auto=format&fit=crop&w=640&q=80'
};

const dir = path.join(__dirname, 'frontend/public/images/crops');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

console.log('Downloading reliable images from Unsplash...');

Object.entries(images).forEach(([filename, url]) => {
    try {
        console.log(`Downloading ${filename}...`);
        // Added -L for redirects and User-Agent to avoid some blocks (though Unsplash is usually open)
        execSync(`curl -L -A "Mozilla/5.0" -o "${path.join(dir, filename)}" "${url}"`, { stdio: 'inherit' });
        
        // Verify file size > 5KB to ensure it's not an error page
        const stats = fs.statSync(path.join(dir, filename));
        if (stats.size < 5000) {
             console.error(`⚠️ Warning: ${filename} is too small (${stats.size} bytes). Might be an error page.`);
        } else {
             console.log(`✅ ${filename} saved (${Math.round(stats.size/1024)}KB).`);
        }
    } catch (e) {
        console.error(`❌ Failed to download ${filename}:`, e.message);
    }
});

console.log('Done.');
