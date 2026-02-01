const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3001';
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function testQualityFeature() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  try {
    console.log('📱 Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
    
    // Login
    await page.type('input[type="tel"]', '9999000001');
    await page.click('button[type="submit"]');
    await delay(1000); // Wait for API
    
    await page.waitForSelector('input[placeholder*="Enter OTP"]');
    await page.type('input[placeholder*="Enter OTP"]', '123456');
    await page.click('button[type="submit"]');
    await delay(3000); 
    
    console.log('✅ Logged in successfully');

    // Go to Create Listing
    console.log('🔍 Navigating to Create Listing...');
    await page.goto(`${BASE_URL}/create-listing`, { waitUntil: 'networkidle0' });
    
    // Wait for form
    await page.waitForSelector('form');

    // Test Quality Check Button Presence
    console.log('🧪 Test: AI Quality Check Button');
    const buttonText = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtn = buttons.find(b => b.textContent.includes('Verify Quality'));
      return verifyBtn ? verifyBtn.textContent : null;
    });

    if (buttonText) {
      console.log('   ✅ "Verify Quality (AI)" button found');
    } else {
      console.log('   ❌ "Verify Quality (AI)" button NOT found');
    }

    // Attempt to click and simulate flow (Mock image needs to be selected first)
    // Select fake image (simulated click on Select Image)
    const selectImgBtn = await page.evaluateHandle(() => {
       return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Select Image'));
    });
    if (selectImgBtn) {
       await selectImgBtn.click();
       await delay(500);
       console.log('   📸 Image Selected (Mock)');
    }

    // Click Analyze
    const analyzeBtn = await page.evaluateHandle(() => {
       return Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Verify Quality'));
    });
    if (analyzeBtn && !analyzeBtn.disabled) {
       await analyzeBtn.click();
       console.log('   ⚙️ AI Analysis started...');
       
       // Wait for result (simulated 1.5s delay)
       await delay(4000);
       
       // Check for results
       const resultVisible = await page.evaluate(() => {
          return document.body.innerText.includes('AI Quality Assessment');
       });
       
       if (resultVisible) {
          console.log('   ✅ AI Result displayed');
       } else {
          console.log('   ❌ AI Result not displayed (Timeout or Error)');
       }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
    console.log('\n🎉 Quality AI tests completed');
  }
}

testQualityFeature();
