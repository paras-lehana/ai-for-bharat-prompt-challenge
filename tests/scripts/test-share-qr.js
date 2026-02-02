/**
 * Share & QR Feature Test Script
 * Tests Task 59 & 60: Share Listings and QR Code
 */

const puppeteer = require('puppeteer');

const BASE_URL = 'http://localhost:3001';
const TEST_USER = {
  phoneNumber: '+919999000003',
  otp: '1104'
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login(page) {
  console.log('📱 Logging in...');
  
  // Handle alerts
  page.on('dialog', async dialog => {
    console.log(`   Alert dismissed: ${dialog.message()}`);
    await dialog.dismiss();
  });
  
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });
  
  await page.waitForSelector('input[type="tel"]', { timeout: 5000 });
  await page.type('input[type="tel"]', TEST_USER.phoneNumber);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Send OTP'));
    if (btn) btn.click();
  });
  
  await delay(1000);
  
  await page.waitForSelector('input[placeholder*="OTP"]', { timeout: 5000 });
  await page.type('input[placeholder*="OTP"]', TEST_USER.otp);
  
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Verify & Login'));
    if (btn) btn.click();
  });
  
  await delay(3000);
  console.log('✅ Logged in successfully');
}

async function testShareFeature(page) {
  console.log('\n🧪 Test 1: Share Feature');
  
  // Go to a listing
  await page.goto(`${BASE_URL}/browse`, { waitUntil: 'networkidle0' });
  await delay(2000);
  
  // Click first listing
  await page.evaluate(() => {
    const card = document.querySelector('a.card');
    if (card) card.click();
    else throw new Error('No listings found');
  });
  await delay(2000);
  
  // Find Share button
  const shareBtnExists = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Share'));
    return !!btn;
  });
  console.log(`   Share button exists: ${shareBtnExists}`);
  
  if (!shareBtnExists) return false;
  
  // Click Share
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Share'));
    if (btn) btn.click();
  });
  await delay(500);
  
  // Check for options
  const options = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      whatsapp: text.includes('WhatsApp'),
      sms: text.includes('SMS'),
      email: text.includes('Email'),
      copy: text.includes('Copy Link')
    };
  });
  
  console.log('   Share options found:', options);
  
  // Close menu
  await page.mouse.click(10, 10);
  await delay(500);
  
  return options.whatsapp && options.sms;
}

async function testQRFeature(page) {
  console.log('\n🧪 Test 2: QR Code Feature');
  
  // Find QR button
  const qrBtnExists = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('QR Code'));
    return !!btn;
  });
  console.log(`   QR button exists: ${qrBtnExists}`);
  
  if (!qrBtnExists) return false;
  
  // Click QR
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('QR Code'));
    if (btn) btn.click();
  });
  await delay(2000); // Wait for fetch
  
  // Check for QR image
  const qrImageExists = await page.evaluate(() => {
    const img = document.querySelector('img[alt="QR Code"]');
    return !!img && img.src.startsWith('data:image/png;base64');
  });
  
  console.log(`   QR Image rendered: ${qrImageExists}`);
  
  // Check functionality
  const downloadBtnExists = await page.evaluate(() => {
    return !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Download'));
  });
  
  console.log(`   Download button exists: ${downloadBtnExists}`);
  
  return qrImageExists;
}

async function runTests() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    await login(page);
    await testShareFeature(page);
    await testQRFeature(page);
    console.log('\n🎉 Share and QR tests completed');
  } catch (e) {
    console.error('❌ Test failed:', e);
  } finally {
    await browser.close();
  }
}

runTests();
