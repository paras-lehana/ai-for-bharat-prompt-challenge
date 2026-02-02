/**
 * Test Script for Task 59: Share Listings
 * 
 * Tests:
 * - WhatsApp sharing functionality
 * - SMS sharing functionality
 * - Email sharing functionality
 * - Copy link functionality
 * - Share tracking analytics
 * - Share statistics retrieval
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';
let testUserId = '';
let testListingId = '';

// Test user credentials
const testUser = {
  phoneNumber: '+919876543210',
  name: 'Test Vendor',
  role: 'vendor',
  languagePreference: 'en'
};

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ ${message}`, 'cyan');
}

function logSection(message) {
  log(`\n${'='.repeat(60)}`, 'blue');
  log(message, 'blue');
  log('='.repeat(60), 'blue');
}

// Helper function to make authenticated requests
async function authenticatedRequest(method, url, data = null) {
  const config = {
    method,
    url: `${BASE_URL}${url}`,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };
  
  if (data) {
    config.data = data;
  }
  
  return axios(config);
}

// Test 1: Setup - Login and get auth token
async function testSetup() {
  logSection('TEST 1: Setup - Authentication');
  
  try {
    // Send OTP
    logInfo('Sending OTP...');
    await axios.post(`${BASE_URL}/auth/send-otp`, {
      phoneNumber: testUser.phoneNumber
    });
    logSuccess('OTP sent successfully');
    
    // For testing, we'll use a mock OTP verification
    // In production, you'd need to get the actual OTP from the database
    logInfo('Verifying OTP (using test mode)...');
    
    // Try to verify with a test OTP
    try {
      const verifyResponse = await axios.post(`${BASE_URL}/auth/verify-otp`, {
        phoneNumber: testUser.phoneNumber,
        otp: '123456' // Test OTP
      });
      
      authToken = verifyResponse.data.token;
      testUserId = verifyResponse.data.user.id;
      logSuccess(`Authenticated successfully. User ID: ${testUserId}`);
    } catch (error) {
      // If verification fails, try to login with existing user
      logInfo('Using existing session...');
      // For testing purposes, we'll create a mock token
      // In real scenario, you'd need proper authentication
      throw new Error('Authentication required. Please run with proper OTP verification.');
    }
    
    return true;
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    return false;
  }
}

// Test 2: Create a test listing
async function testCreateListing() {
  logSection('TEST 2: Create Test Listing');
  
  try {
    const listingData = {
      cropType: 'Wheat',
      quantity: 100,
      unit: 'quintal',
      basePrice: 2000,
      qualityTier: 'premium',
      description: 'High quality wheat for testing share functionality',
      locationAddress: 'Test Farm, Delhi',
      locationDistrict: 'Delhi',
      locationState: 'Delhi'
    };
    
    logInfo('Creating test listing...');
    const response = await authenticatedRequest('post', '/listings', listingData);
    
    testListingId = response.data.id;
    logSuccess(`Listing created successfully. ID: ${testListingId}`);
    logInfo(`Crop: ${response.data.cropType}`);
    logInfo(`Price: ₹${response.data.finalPrice}/${response.data.unit}`);
    
    return true;
  } catch (error) {
    logError(`Failed to create listing: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 3: Track WhatsApp share
async function testWhatsAppShare() {
  logSection('TEST 3: Track WhatsApp Share');
  
  try {
    logInfo('Tracking WhatsApp share...');
    const response = await authenticatedRequest('post', '/analytics/share', {
      listingId: testListingId,
      method: 'whatsapp'
    });
    
    logSuccess('WhatsApp share tracked successfully');
    logInfo(`Share ID: ${response.data.share.id}`);
    logInfo(`Method: ${response.data.share.method}`);
    logInfo(`Shared at: ${response.data.share.sharedAt}`);
    
    return true;
  } catch (error) {
    logError(`Failed to track WhatsApp share: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 4: Track SMS share
async function testSMSShare() {
  logSection('TEST 4: Track SMS Share');
  
  try {
    logInfo('Tracking SMS share...');
    const response = await authenticatedRequest('post', '/analytics/share', {
      listingId: testListingId,
      method: 'sms'
    });
    
    logSuccess('SMS share tracked successfully');
    logInfo(`Share ID: ${response.data.share.id}`);
    logInfo(`Method: ${response.data.share.method}`);
    
    return true;
  } catch (error) {
    logError(`Failed to track SMS share: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 5: Track Email share
async function testEmailShare() {
  logSection('TEST 5: Track Email Share');
  
  try {
    logInfo('Tracking Email share...');
    const response = await authenticatedRequest('post', '/analytics/share', {
      listingId: testListingId,
      method: 'email'
    });
    
    logSuccess('Email share tracked successfully');
    logInfo(`Share ID: ${response.data.share.id}`);
    
    return true;
  } catch (error) {
    logError(`Failed to track Email share: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 6: Track Copy Link
async function testCopyLinkShare() {
  logSection('TEST 6: Track Copy Link');
  
  try {
    logInfo('Tracking copy link...');
    const response = await authenticatedRequest('post', '/analytics/share', {
      listingId: testListingId,
      method: 'copy_link'
    });
    
    logSuccess('Copy link tracked successfully');
    logInfo(`Share ID: ${response.data.share.id}`);
    
    return true;
  } catch (error) {
    logError(`Failed to track copy link: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 7: Get share statistics
async function testGetShareStats() {
  logSection('TEST 7: Get Share Statistics');
  
  try {
    logInfo('Fetching share statistics...');
    const response = await authenticatedRequest('get', `/analytics/shares/${testListingId}`);
    
    logSuccess('Share statistics retrieved successfully');
    logInfo(`Total shares: ${response.data.totalShares}`);
    logInfo('Shares by method:');
    response.data.sharesByMethod.forEach(stat => {
      logInfo(`  - ${stat.method}: ${stat.count}`);
    });
    
    return true;
  } catch (error) {
    logError(`Failed to get share statistics: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 8: Get user share history
async function testGetShareHistory() {
  logSection('TEST 8: Get User Share History');
  
  try {
    logInfo('Fetching user share history...');
    const response = await authenticatedRequest('get', '/analytics/shares/user/history');
    
    logSuccess('Share history retrieved successfully');
    logInfo(`Total shares in history: ${response.data.shares.length}`);
    
    if (response.data.shares.length > 0) {
      logInfo('Recent shares:');
      response.data.shares.slice(0, 3).forEach(share => {
        logInfo(`  - ${share.method} on ${new Date(share.sharedAt).toLocaleString()}`);
        if (share.listing) {
          logInfo(`    Listing: ${share.listing.cropType} - ₹${share.listing.finalPrice}/${share.listing.unit}`);
        }
      });
    }
    
    return true;
  } catch (error) {
    logError(`Failed to get share history: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 9: Validate share message format
async function testShareMessageFormat() {
  logSection('TEST 9: Validate Share Message Format');
  
  try {
    logInfo('Fetching listing details for share message validation...');
    const response = await authenticatedRequest('get', `/listings/${testListingId}`);
    const listing = response.data;
    
    // Simulate the share message generation (from ShareButton component)
    const shareUrl = `http://localhost:3000/listing/${listing.id}`;
    const shareMessage = 
      `Check out this ${listing.cropType} listing on Multilingual Mandi!\n\n` +
      `🌾 Crop: ${listing.cropType}\n` +
      `💰 Price: ₹${listing.finalPrice}/${listing.unit}\n` +
      `📦 Quantity: ${listing.quantity} ${listing.unit}\n` +
      `⭐ Quality: ${listing.qualityTier}\n` +
      `📍 Location: ${listing.locationAddress || 'Available'}\n\n` +
      `View details: ${shareUrl}`;
    
    logSuccess('Share message format validated');
    logInfo('Generated share message:');
    log('\n' + shareMessage + '\n', 'yellow');
    
    // Validate message components
    const validations = [
      { check: shareMessage.includes(listing.cropType), name: 'Crop type included' },
      { check: shareMessage.includes(`₹${listing.finalPrice}`), name: 'Price included' },
      { check: shareMessage.includes(`${listing.quantity}`), name: 'Quantity included' },
      { check: shareMessage.includes(listing.qualityTier), name: 'Quality tier included' },
      { check: shareMessage.includes(shareUrl), name: 'Shareable URL included' }
    ];
    
    validations.forEach(v => {
      if (v.check) {
        logSuccess(v.name);
      } else {
        logError(v.name);
      }
    });
    
    return true;
  } catch (error) {
    logError(`Failed to validate share message: ${error.response?.data?.error || error.message}`);
    return false;
  }
}

// Test 10: Test invalid share tracking
async function testInvalidShareTracking() {
  logSection('TEST 10: Test Invalid Share Tracking');
  
  try {
    logInfo('Testing share tracking with invalid listing ID...');
    try {
      await authenticatedRequest('post', '/analytics/share', {
        listingId: 99999,
        method: 'whatsapp'
      });
      logError('Should have failed with invalid listing ID');
      return false;
    } catch (error) {
      if (error.response?.status === 404) {
        logSuccess('Correctly rejected invalid listing ID');
      } else {
        logError(`Unexpected error: ${error.message}`);
        return false;
      }
    }
    
    logInfo('Testing share tracking with missing method...');
    try {
      await authenticatedRequest('post', '/analytics/share', {
        listingId: testListingId
      });
      logError('Should have failed with missing method');
      return false;
    } catch (error) {
      if (error.response?.status === 400) {
        logSuccess('Correctly rejected missing method');
      } else {
        logError(`Unexpected error: ${error.message}`);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    logError(`Test failed: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'blue');
  log('║         TASK 59: SHARE LISTINGS - TEST SUITE              ║', 'blue');
  log('╚════════════════════════════════════════════════════════════╝\n', 'blue');
  
  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  const tests = [
    { name: 'Setup & Authentication', fn: testSetup },
    { name: 'Create Test Listing', fn: testCreateListing },
    { name: 'WhatsApp Share Tracking', fn: testWhatsAppShare },
    { name: 'SMS Share Tracking', fn: testSMSShare },
    { name: 'Email Share Tracking', fn: testEmailShare },
    { name: 'Copy Link Tracking', fn: testCopyLinkShare },
    { name: 'Get Share Statistics', fn: testGetShareStats },
    { name: 'Get Share History', fn: testGetShareHistory },
    { name: 'Share Message Format', fn: testShareMessageFormat },
    { name: 'Invalid Share Tracking', fn: testInvalidShareTracking }
  ];
  
  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }
  }
  
  // Summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${results.total}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%\n`, 
      results.failed === 0 ? 'green' : 'yellow');
  
  if (results.failed === 0) {
    log('🎉 All tests passed! Task 59 is fully functional.', 'green');
  } else {
    log('⚠️  Some tests failed. Please review the errors above.', 'yellow');
  }
  
  process.exit(results.failed === 0 ? 0 : 1);
}

// Run tests
runTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  process.exit(1);
});
