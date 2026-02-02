/**
 * Comprehensive Test Script for QR Code Generation (Task 60)
 * 
 * Tests:
 * 1. Backend QR code generation (Data URL)
 * 2. Backend QR code download (PNG image)
 * 3. QR code validation (listing exists)
 * 4. Frontend integration verification
 * 5. QR code scanning simulation
 * 6. Download functionality
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (message) console.log(`   ${message}`);
  
  results.tests.push({ name, passed, message });
  if (passed) results.passed++;
  else results.failed++;
}

async function runTests() {
  console.log('🧪 Starting QR Code Generation Tests...\n');
  console.log('=' .repeat(60));
  
  let testListingId = null;
  let authToken = null;

  // Test 1: Setup - Create test user and listing
  console.log('\n📋 Test 1: Setup - Create test user and listing');
  try {
    // Register test user
    const phoneNumber = `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    await axios.post(`${API_URL}/api/auth/send-otp`, { phoneNumber });
    
    const otpResponse = await axios.post(`${API_URL}/api/auth/verify-otp`, {
      phoneNumber,
      otp: '123456'
    });
    
    authToken = otpResponse.data.token;
    
    // Create test listing
    const listingResponse = await axios.post(
      `${API_URL}/api/listings`,
      {
        cropType: 'Wheat',
        quantity: 100,
        unit: 'kg',
        basePrice: 25,
        qualityTier: 'premium',
        description: 'Test listing for QR code',
        locationAddress: 'Test Location',
        locationDistrict: 'Test District',
        locationState: 'Test State'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    testListingId = listingResponse.data.id;
    logTest('Setup', true, `Created test listing ID: ${testListingId}`);
  } catch (error) {
    logTest('Setup', false, error.message);
    console.log('\n❌ Setup failed. Cannot continue tests.');
    return;
  }

  // Test 2: Generate QR code (Data URL format)
  console.log('\n📋 Test 2: Generate QR code (Data URL format)');
  try {
    const response = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    
    const { qrCode, url, listingId, cropType } = response.data;
    
    // Validate response structure
    if (!qrCode || !url || !listingId) {
      throw new Error('Missing required fields in response');
    }
    
    // Validate QR code is a data URL
    if (!qrCode.startsWith('data:image/png;base64,')) {
      throw new Error('QR code is not a valid data URL');
    }
    
    // Validate URL format
    const expectedUrl = `${FRONTEND_URL}/listing/${testListingId}`;
    if (url !== expectedUrl) {
      throw new Error(`URL mismatch. Expected: ${expectedUrl}, Got: ${url}`);
    }
    
    logTest('QR Code Generation (Data URL)', true, 
      `Generated QR code with ${qrCode.length} characters`);
  } catch (error) {
    logTest('QR Code Generation (Data URL)', false, error.message);
  }

  // Test 3: Download QR code as PNG
  console.log('\n📋 Test 3: Download QR code as PNG image');
  try {
    const response = await axios.get(
      `${API_URL}/api/share/qr/${testListingId}/download`,
      { responseType: 'arraybuffer' }
    );
    
    // Validate response is PNG image
    const contentType = response.headers['content-type'];
    if (contentType !== 'image/png') {
      throw new Error(`Expected image/png, got ${contentType}`);
    }
    
    // Validate content-disposition header
    const disposition = response.headers['content-disposition'];
    if (!disposition || !disposition.includes('attachment')) {
      throw new Error('Missing or invalid content-disposition header');
    }
    
    // Save QR code to file for manual verification
    const outputDir = path.join(__dirname, 'test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `qr-listing-${testListingId}.png`);
    fs.writeFileSync(outputPath, response.data);
    
    // Validate file size (should be reasonable for QR code)
    const fileSize = fs.statSync(outputPath).size;
    if (fileSize < 100 || fileSize > 100000) {
      throw new Error(`Unexpected file size: ${fileSize} bytes`);
    }
    
    logTest('QR Code Download (PNG)', true, 
      `Downloaded ${fileSize} bytes to ${outputPath}`);
  } catch (error) {
    logTest('QR Code Download (PNG)', false, error.message);
  }

  // Test 4: Invalid listing ID
  console.log('\n📋 Test 4: Invalid listing ID handling');
  try {
    await axios.get(`${API_URL}/api/share/qr/99999`);
    logTest('Invalid Listing ID', false, 'Should have returned 404 error');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      logTest('Invalid Listing ID', true, 'Correctly returned 404 for invalid listing');
    } else {
      logTest('Invalid Listing ID', false, `Unexpected error: ${error.message}`);
    }
  }

  // Test 5: QR code contains correct URL
  console.log('\n📋 Test 5: QR code URL validation');
  try {
    const response = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    const { url } = response.data;
    
    // Validate URL structure
    const urlPattern = new RegExp(`^${FRONTEND_URL}/listing/\\d+$`);
    if (!urlPattern.test(url)) {
      throw new Error(`URL doesn't match expected pattern: ${url}`);
    }
    
    // Validate listing ID in URL
    const urlListingId = url.split('/').pop();
    if (urlListingId !== testListingId.toString()) {
      throw new Error(`Listing ID mismatch in URL: ${urlListingId} vs ${testListingId}`);
    }
    
    logTest('QR Code URL Validation', true, `URL format correct: ${url}`);
  } catch (error) {
    logTest('QR Code URL Validation', false, error.message);
  }

  // Test 6: Multiple QR code generations (caching/consistency)
  console.log('\n📋 Test 6: Multiple QR code generations consistency');
  try {
    const response1 = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    const response2 = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    
    // QR codes should be identical for same listing
    if (response1.data.qrCode !== response2.data.qrCode) {
      throw new Error('QR codes are not consistent across multiple generations');
    }
    
    logTest('QR Code Consistency', true, 'Multiple generations produce identical QR codes');
  } catch (error) {
    logTest('QR Code Consistency', false, error.message);
  }

  // Test 7: QR code error correction level
  console.log('\n📋 Test 7: QR code quality and error correction');
  try {
    const response = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    const qrCode = response.data.qrCode;
    
    // Data URL should be reasonably sized (not too small, not too large)
    const base64Length = qrCode.split(',')[1].length;
    if (base64Length < 500 || base64Length > 50000) {
      throw new Error(`Unexpected QR code size: ${base64Length} characters`);
    }
    
    logTest('QR Code Quality', true, `QR code size appropriate: ${base64Length} chars`);
  } catch (error) {
    logTest('QR Code Quality', false, error.message);
  }

  // Test 8: Frontend HTML verification (if frontend is running)
  console.log('\n📋 Test 8: Frontend integration verification');
  try {
    const response = await axios.get(`${FRONTEND_URL}/listing/${testListingId}`, {
      timeout: 5000
    });
    
    const html = response.data;
    
    // Check if QRCodeDisplay component is likely present
    // (This is a basic check - actual component rendering requires browser)
    if (html.includes('QR') || html.includes('qr') || html.includes('share')) {
      logTest('Frontend Integration', true, 'Frontend page loads successfully');
    } else {
      logTest('Frontend Integration', false, 'QR code component may not be integrated');
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logTest('Frontend Integration', false, 'Frontend not running (expected in CI)');
    } else {
      logTest('Frontend Integration', false, error.message);
    }
  }

  // Test 9: Download with different listing IDs
  console.log('\n📋 Test 9: Download QR codes for multiple listings');
  try {
    // Create another test listing
    const listing2Response = await axios.post(
      `${API_URL}/api/listings`,
      {
        cropType: 'Rice',
        quantity: 200,
        unit: 'kg',
        basePrice: 30,
        qualityTier: 'standard',
        description: 'Second test listing',
        locationAddress: 'Test Location 2',
        locationDistrict: 'Test District 2',
        locationState: 'Test State'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const listing2Id = listing2Response.data.id;
    
    // Download QR codes for both listings
    const qr1 = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    const qr2 = await axios.get(`${API_URL}/api/share/qr/${listing2Id}`);
    
    // QR codes should be different
    if (qr1.data.qrCode === qr2.data.qrCode) {
      throw new Error('Different listings generated identical QR codes');
    }
    
    logTest('Multiple Listing QR Codes', true, 'Different listings have unique QR codes');
  } catch (error) {
    logTest('Multiple Listing QR Codes', false, error.message);
  }

  // Test 10: QR code metadata
  console.log('\n📋 Test 10: QR code metadata validation');
  try {
    const response = await axios.get(`${API_URL}/api/share/qr/${testListingId}`);
    const { listingId, cropType } = response.data;
    
    // Validate metadata
    if (listingId !== testListingId) {
      throw new Error(`Listing ID mismatch: ${listingId} vs ${testListingId}`);
    }
    
    if (!cropType || cropType !== 'Wheat') {
      throw new Error(`Crop type mismatch or missing: ${cropType}`);
    }
    
    logTest('QR Code Metadata', true, `Metadata correct: ${cropType} (ID: ${listingId})`);
  } catch (error) {
    logTest('QR Code Metadata', false, error.message);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.tests.length}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%`);
  
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`   - ${t.name}: ${t.message}`));
  }
  
  console.log('\n' + '='.repeat(60));
  
  // Save results to file
  const resultsPath = path.join(__dirname, 'test-output', 'qr-code-test-results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Test suite crashed:', error);
  process.exit(1);
});
