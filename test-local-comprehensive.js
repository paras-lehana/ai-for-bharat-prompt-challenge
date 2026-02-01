/**
 * Comprehensive Local Testing Script for Multilingual Mandi
 * Tests all 7 core initiatives and critical functionality
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
const FRONTEND_URL = 'http://localhost:3001';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`\n${status}: ${name}`);
  if (details) console.log(`   ${details}`);
  
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

// Test 1: Backend Health Check
async function testBackendHealth() {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    logTest('Backend Health Check', response.data.status === 'ok', 
      `Status: ${response.data.status}`);
  } catch (error) {
    logTest('Backend Health Check', false, error.message);
  }
}

// Test 2: Authentication - Send OTP
async function testSendOTP() {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
      phoneNumber: '+919876543210'
    });
    logTest('Auth - Send OTP', response.data.success === true,
      `OTP sent: ${response.data.success}`);
  } catch (error) {
    logTest('Auth - Send OTP', false, error.message);
  }
}

// Test 3: Listings - Search (Public endpoint)
async function testListingsSearch() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/listings/search`);
    const listings = response.data.listings || response.data;
    const isValid = Array.isArray(listings);
    logTest('Listings - Search', isValid,
      `Found ${listings.length} listings`);
  } catch (error) {
    logTest('Listings - Search', false, error.message);
  }
}

// Test 4: Prices - Get Current Prices
async function testGetPrices() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/prices/current?cropType=wheat`);
    logTest('Prices - Get Current', response.data !== null,
      `Price data available: ${response.data ? 'Yes' : 'No'}`);
  } catch (error) {
    logTest('Prices - Get Current', false, error.message);
  }
}

// Test 5: Voice - Parse Intent (Kisaan Bot)
async function testVoiceIntent() {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/voice/parse-intent`, {
      text: 'What is the price of wheat in Delhi?',
      language: 'en'
    });
    logTest('Voice - Parse Intent', response.data.intent !== undefined,
      `Intent detected: ${response.data.intent}`);
  } catch (error) {
    logTest('Voice - Parse Intent', false, error.message);
  }
}

// Test 6: Discovery - Get Nearby Vendors
async function testNearbyVendors() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/discovery/nearby`, {
      params: {
        cropType: 'wheat',
        latitude: 28.6139,
        longitude: 77.2090,
        radiusKm: 50
      }
    });
    const vendors = response.data.vendors || response.data;
    const isValid = Array.isArray(vendors);
    logTest('Discovery - Nearby Vendors', isValid,
      `Found ${vendors.length} nearby vendors`);
  } catch (error) {
    logTest('Discovery - Nearby Vendors', false, error.message);
  }
}

// Test 7: Integration - eNAM Prices
async function testENAMIntegration() {
  try {
    // eNAM prices are available through /api/prices/current
    const response = await axios.get(`${BACKEND_URL}/api/prices/current`, {
      params: { cropType: 'wheat' }
    });
    const hasPrice = response.data && (response.data.modalPrice || response.data.price);
    logTest('Integration - eNAM Prices', hasPrice,
      `eNAM data available: ${hasPrice ? 'Yes' : 'No'}`);
  } catch (error) {
    logTest('Integration - eNAM Prices', false, error.message);
  }
}

// Test 8: Frontend - Homepage Loads
async function testFrontendHomepage() {
  try {
    const response = await axios.get(FRONTEND_URL);
    logTest('Frontend - Homepage Loads', response.status === 200,
      `Status: ${response.status}`);
  } catch (error) {
    logTest('Frontend - Homepage Loads', false, error.message);
  }
}

// Test 9: Favorites Feature
async function testFavoritesEndpoint() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/favorites`, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    // Even if unauthorized, endpoint should exist
    logTest('Favorites - Endpoint Exists', 
      response.status === 200 || response.status === 401,
      `Status: ${response.status}`);
  } catch (error) {
    // 401 is acceptable - means endpoint exists but needs auth
    logTest('Favorites - Endpoint Exists', 
      error.response && error.response.status === 401,
      error.response ? `Status: ${error.response.status}` : error.message);
  }
}

// Test 10: Saved Searches Feature
async function testSavedSearchesEndpoint() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/saved-searches`, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    logTest('Saved Searches - Endpoint Exists', 
      response.status === 200 || response.status === 401,
      `Status: ${response.status}`);
  } catch (error) {
    logTest('Saved Searches - Endpoint Exists', 
      error.response && error.response.status === 401,
      error.response ? `Status: ${error.response.status}` : error.message);
  }
}

// Test 11: Weather Feature
async function testWeatherEndpoint() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/weather`, {
      params: { latitude: 28.6139, longitude: 77.2090 }
    });
    logTest('Weather - Endpoint Exists', response.status === 200,
      `Status: ${response.status}`);
  } catch (error) {
    // Weather is a Phase 1 feature - may not be implemented yet
    const isNotImplemented = error.response && error.response.status === 404;
    logTest('Weather - Endpoint Exists', false, 
      isNotImplemented ? 'Not implemented (Phase 1 feature)' : error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log('\n🚀 COMPREHENSIVE LOCAL TESTING - MULTILINGUAL MANDI');
  console.log('=' .repeat(60));
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log('=' .repeat(60));

  console.log('\n📋 CORE FUNCTIONALITY TESTS');
  console.log('-'.repeat(60));
  
  await testBackendHealth();
  await testSendOTP();
  await testListingsSearch();
  await testGetPrices();
  await testVoiceIntent();
  await testNearbyVendors();
  await testENAMIntegration();
  await testFrontendHomepage();
  
  console.log('\n📋 NEW FEATURES TESTS (Phase 1)');
  console.log('-'.repeat(60));
  
  await testFavoritesEndpoint();
  await testSavedSearchesEndpoint();
  await testWeatherEndpoint();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));

  // Save results
  const fs = require('fs');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-results-local-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${filename}\n`);

  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
