const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3001';

// Delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testWeatherWidget() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  // Handle alerts
  page.on('dialog', async dialog => {
    console.log(`   🔔 Alert: ${dialog.message()}`);
    await dialog.dismiss();
  });

  page.on('console', msg => console.log('   📄 Page Log:', msg.text()));

  try {
    console.log('📱 Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    
    // Login Step 1: Phone
    await page.type('input[type="tel"]', '9999000001');
    await page.click('button[type="submit"]');
    
    await delay(1000); // Wait for API and transition
    
    // Login Step 2: OTP
    await page.waitForSelector('input[placeholder*="Enter OTP"]');
    await page.type('input[placeholder*="Enter OTP"]', '123456');
    await page.click('button[type="submit"]');
    
    await delay(3000); // Wait for navigation and load
    
    console.log('✅ Logged in successfully');
    
    // Check for Weather Widget
    console.log('\n🧪 Test 1: Weather Widget Presence');
    
    // Wait for widget to appear (it has animate-fade-in class)
    await page.waitForSelector('.animate-fade-in', { timeout: 10000 });
    
    // Check content
    const widgetContent = await page.evaluate(() => {
      const widget = document.querySelector('.animate-fade-in'); // Assuming it's the first fading element or specific class
      if (!widget) return null;
      return widget.innerText;
    });
    
    if (widgetContent && (widgetContent.includes('°') || widgetContent.includes('Wind:'))) {
      console.log('   ✅ Weather Widget visible');
      console.log('   Content:', widgetContent.substring(0, 100).replace(/\n/g, ' '));
    } else {
      console.log('   ❌ Weather Widget not found or empty');
      console.log('   Found text:', widgetContent);
    }
    
    // Check forecast elements
    const forecastDays = await page.evaluate(() => {
      // Forecast grid has grid-cols-4
      return document.querySelectorAll('.grid-cols-4 > div').length;
    });
    
    if (forecastDays >= 4) {
      console.log(`   ✅ Forecast visible (${forecastDays} days)`);
    } else {
      console.log(`   ❌ Forecast missing or incomplete (found ${forecastDays} items)`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('\n🎉 Weather tests completed');
  }
}

testWeatherWidget();
