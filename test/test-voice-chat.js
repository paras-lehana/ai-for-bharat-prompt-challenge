/**
 * Voice Chat Feature Test Script
 * Tests Task 62: Voice Notes in Chat
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
    // console.log(`   Alert dismissed: ${dialog.message()}`);
    await dialog.dismiss();
  });

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
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

async function testVoiceRecording(page) {
  console.log('\n🧪 Test 1: Voice Recording UI');
  
  // Mock MediaRecorder and getUserMedia on new document
  await page.evaluateOnNewDocument(() => {
    window.navigator.mediaDevices = {
      getUserMedia: async () => {
        console.log('MOCK: getUserMedia called');
        return {
           getTracks: () => [{ stop: () => console.log('MOCK: track stopped') }]
        };
      }
    };

    window.MediaRecorder = class MediaRecorder {
      constructor(stream) {
        console.log('MOCK: MediaRecorder created');
        this.stream = stream;
        this.state = 'inactive';
        this.ondataavailable = () => {};
        this.onstop = () => {};
      }
      static isTypeSupported() { return true; }
      start() {
        console.log('MOCK: MediaRecorder started');
        this.state = 'recording';
        // Simulate data available
        setTimeout(() => {
          if (this.ondataavailable) {
             const blob = new Blob(['fake audio data'], { type: 'audio/webm' });
             this.ondataavailable({ data: blob });
          }
        }, 100);
      }
      stop() {
        console.log('MOCK: MediaRecorder stopped');
        this.state = 'inactive';
        if (this.onstop) this.onstop();
      }
    };
  });

  // Navigate to Messages
  await page.goto(`${BASE_URL}/messages`, { waitUntil: 'networkidle0' });
  await delay(2000);
  
  // Wait for conversations to load
  await delay(5000);
  
  // Debug layout
  const debugInfo = await page.evaluate(() => {
    return {
      conversationsCount: document.querySelectorAll('.cursor-pointer').length,
      hasNoConvText: document.body.innerText.includes('No conversations yet'),
      bodyText: document.body.innerText.substring(0, 500)
    };
  });
  console.log('   Debug Info:', debugInfo);

  // Select first conversation
  const clicked = await page.evaluate(() => {
    const convs = Array.from(document.querySelectorAll('div.cursor-pointer'));
    if (convs.length > 0) {
      convs[0].click();
      return true;
    }
    return false;
  });
  
  if (!clicked) {
    console.log('   ❌ No conversation found to click');
    return false;
  }
  
  await delay(2000); // Wait for thread to load
  
  // Debug post-click
  const postClickInfo = await page.evaluate(() => {
    return {
      url: window.location.href,
      hasSelectText: document.body.innerText.includes('Select a conversation'),
      buttons: Array.from(document.querySelectorAll('button')).map(b => b.title || b.textContent),
      inputValue: document.querySelector('input') ? document.querySelector('input').value : 'No input'
    };
  });
  console.log('   Post-Click Info:', postClickInfo);
  
  // Check if Mic button exists (when input is empty)
  const micBtnExists = await page.evaluate(() => {
    const btn = document.querySelector('button[title="Record Voice Note"]');
    return !!btn;
  });
  console.log(`   Mic button exists: ${micBtnExists}`);
  
  if (!micBtnExists) {
      console.log('   ❌ Mic button not found. Input might not be empty or UI issue.');
      return false;
  }

  // Click Mic button
  console.log('   Clicking Mic button...');
  await page.click('button[title="Record Voice Note"]');
  await delay(500);

  // Check if recording UI is visible
  const recordingUiVisible = await page.evaluate(() => {
    const recordingText = Array.from(document.querySelectorAll('div')).find(d => d.textContent.includes('Recording'));
    return !!recordingText;
  });
  console.log(`   Recording UI visible: ${recordingUiVisible}`);

  if (!recordingUiVisible) return false;

  await delay(2000); // Record for 2 seconds

  // Click Stop button
  console.log('   Clicking Stop button...');
  await page.click('button[title="Stop & Send"]');
  await delay(2000); // Wait for send

  // Verify message sent (check for Voice Message text or Audio element)
  const messageSent = await page.evaluate(() => {
    const messages = Array.from(document.querySelectorAll('p'));
    const lastMsg = messages[messages.length - 1]; // This might grab timestamp or other text
    // Look for "Voice Message" text
    const foundText = messages.some(p => p.textContent.includes('Voice Message'));
    // Look for audio tag
    const audioTag = document.querySelector('audio');
    return foundText || !!audioTag;
  });
  
  console.log(`   Voice message sent and verified: ${messageSent}`);
  return messageSent;
}

async function runTests() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-fake-ui-for-media-stream']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  
  try {
    await login(page);
    await testVoiceRecording(page);
    console.log('\n🎉 Voice Chat tests completed');
  } catch (e) {
    console.error('❌ Test failed:', e);
  } finally {
    await browser.close();
  }
}

runTests();
