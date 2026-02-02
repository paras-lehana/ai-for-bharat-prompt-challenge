const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3001';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testPredictionFeature() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    console.log('📱 Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    
    // Login Step 1: Phone
    await page.type('input[type="tel"]', '9999000001');
    await page.click('button[type="submit"]');
    await delay(1000); // Wait for API
    
    // Login Step 2: OTP
    await page.waitForSelector('input[placeholder*="Enter OTP"]');
    await page.type('input[placeholder*="Enter OTP"]', '123456');
    await page.click('button[type="submit"]');
    await delay(3000); // Wait for navigation
    
    console.log('✅ Logged in successfully');

    // Go to My Listings to find a listing to view
    console.log('🔍 Navigating to listing detail...');
    await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle0' });
    await delay(2000);

    // Click on first listing
    const firstListingSelector = '.card-interactive';
    await page.waitForSelector(firstListingSelector);
    await page.click(firstListingSelector);
    await delay(3000);

    // Check for Prediction Chart Presence
    console.log('🧪 Test: Prediction Chart Presence');
    
    // Look for chart container or heading
    const chartHeading = await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const predHeading = h3s.find(h => h.innerText.includes('Price Forecast'));
      return predHeading ? predHeading.innerText : null;
    });

    if (chartHeading) {
      console.log('   ✅ Prediction Chart heading found:', chartHeading);
    } else {
      console.log('   ❌ Prediction Chart heading NOT found');
    }

    // Check if Recharts is rendered
    const rechartsSurface = await page.waitForSelector('.recharts-surface', { timeout: 5000 }).catch(() => null);
    
    if (rechartsSurface) {
      console.log('   ✅ Chart visualization rendered (SVG found)');
    } else {
      console.log('   ❌ Chart visualization SVG not found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('\n🎉 Prediction tests completed');
  }
}

testPredictionFeature();
