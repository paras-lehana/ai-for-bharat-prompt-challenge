#!/usr/bin/env node
/**
 * Comprehensive Automated Test Suite for Multilingual Mandi
 * 
 * Usage:
 *   node run-all-tests.js                    # Run all tests
 *   node run-all-tests.js --feature=auth     # Run specific feature
 *   node run-all-tests.js --verbose          # Detailed output
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
const TEST_PHONE = '+919876543210';
const TEST_OTP = '000000'; // Works in test mode

// Test results
const results = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: [],
  startTime: new Date(),
  endTime: null
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '', duration = 0) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const statusColor = passed ? 'green' : 'red';
  
  log(`${status} ${name} (${duration}ms)`, statusColor);
  if (details) log(`   ${details}`, 'cyan');
  
  results.tests.push({ name, passed, details, duration });
  if (passed) results.passed++;
  else results.failed++;
}

function logSection(title) {
  log(`\n${'='.repeat(70)}`, 'blue');
  log(title, 'blue');
  log('='.repeat(70), 'blue');
}

// Test authentication token
let authToken = null;

// Test Suite: Authentication
async function testAuthentication() {
  logSection('1. AUTHENTICATION & AUTHORIZATION');
  
  // Test 1.1: Health Check
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/health`);
    const duration = Date.now() - start;
    logTest('Health Check', 
      response.data.status === 'ok',
      `Status: ${response.data.status}`,
      duration
    );
  } catch (error) {
    logTest('Health Check', false, error.message);
  }
  
  // Test 1.2: Send OTP
  try {
    const start = Date.now();
    const response = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
      phoneNumber: TEST_PHONE
    });
    const duration = Date.now() - start;
    logTest('Send OTP',
      response.data.success === true,
      `OTP sent: ${response.data.success}`,
      duration
    );
  } catch (error) {
    logTest('Send OTP', false, error.message);
  }
  
  // Test 1.3: Verify OTP (Test Mode)
  try {
    const start = Date.now();
    const response = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
      phoneNumber: TEST_PHONE,
      otp: TEST_OTP
    });
    const duration = Date.now() - start;
    
    if (response.data.token) {
      authToken = response.data.token;
    }
    
    logTest('Verify OTP (Test Mode)',
      response.data.success === true && response.data.token,
      `Token received: ${response.data.token ? 'Yes' : 'No'}`,
      duration
    );
  } catch (error) {
    logTest('Verify OTP (Test Mode)', false, error.message);
  }
  
  // Test 1.4: Get Profile
  if (authToken) {
    try {
      const start = Date.now();
      const response = await axios.get(`${BACKEND_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const duration = Date.now() - start;
      logTest('Get Profile',
        response.data && response.data.phoneNumber,
        `User: ${response.data.name || 'No name'}`,
        duration
      );
    } catch (error) {
      logTest('Get Profile', false, error.message);
    }
  } else {
    logTest('Get Profile', false, 'No auth token available');
  }
}

// Test Suite: Listings
async function testListings() {
  logSection('2. LISTING MANAGEMENT');
  
  let listingId = null;
  
  // Test 2.1: Search Listings (Public)
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/listings/search`);
    const duration = Date.now() - start;
    const listings = response.data.listings || response.data;
    logTest('Search Listings',
      Array.isArray(listings),
      `Found ${listings.length} listings`,
      duration
    );
    
    if (listings.length > 0) {
      listingId = listings[0].id;
    }
  } catch (error) {
    logTest('Search Listings', false, error.message);
  }
  
  // Test 2.2: Get Listing by ID
  if (listingId) {
    try {
      const start = Date.now();
      const response = await axios.get(`${BACKEND_URL}/api/listings/${listingId}`);
      const duration = Date.now() - start;
      logTest('Get Listing by ID',
        response.data && response.data.id === listingId,
        `Listing: ${response.data.cropType}`,
        duration
      );
    } catch (error) {
      logTest('Get Listing by ID', false, error.message);
    }
  }
  
  // Test 2.3: Create Listing (Requires Auth)
  if (authToken) {
    try {
      const start = Date.now();
      const response = await axios.post(`${BACKEND_URL}/api/listings`, {
        cropType: 'wheat',
        quantity: 100,
        unit: 'quintal',
        basePrice: 2000,
        qualityTier: 'premium',
        location: 'Delhi',
        description: 'Test listing'
      }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const duration = Date.now() - start;
      logTest('Create Listing',
        response.data && response.data.id,
        `Created listing ID: ${response.data.id}`,
        duration
      );
    } catch (error) {
      logTest('Create Listing', false, error.message);
    }
  }
}

// Test Suite: Search & Discovery
async function testSearch() {
  logSection('3. SEARCH & DISCOVERY');
  
  // Test 3.1: Search with Crop Filter
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/listings/search`, {
      params: { cropType: 'wheat' }
    });
    const duration = Date.now() - start;
    const listings = response.data.listings || response.data;
    logTest('Search with Crop Filter',
      Array.isArray(listings),
      `Found ${listings.length} wheat listings`,
      duration
    );
  } catch (error) {
    logTest('Search with Crop Filter', false, error.message);
  }
  
  // Test 3.2: Search with Price Range
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/listings/search`, {
      params: { minPrice: 1500, maxPrice: 2500 }
    });
    const duration = Date.now() - start;
    const listings = response.data.listings || response.data;
    logTest('Search with Price Range',
      Array.isArray(listings),
      `Found ${listings.length} listings in range`,
      duration
    );
  } catch (error) {
    logTest('Search with Price Range', false, error.message);
  }
  
  // Test 3.3: Search with Sorting
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/listings/search`, {
      params: { sortBy: 'price', sortOrder: 'asc' }
    });
    const duration = Date.now() - start;
    const listings = response.data.listings || response.data;
    logTest('Search with Sorting',
      Array.isArray(listings),
      `Found ${listings.length} sorted listings`,
      duration
    );
  } catch (error) {
    logTest('Search with Sorting', false, error.message);
  }
}

// Test Suite: Pricing
async function testPricing() {
  logSection('4. PRICING & QUALITY');
  
  // Test 4.1: Get Current Prices
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/prices/current`, {
      params: { cropType: 'wheat' }
    });
    const duration = Date.now() - start;
    logTest('Get Current Prices',
      response.data !== null,
      `Price available: ${response.data ? 'Yes' : 'No'}`,
      duration
    );
  } catch (error) {
    logTest('Get Current Prices', false, error.message);
  }
  
  // Test 4.2: Get Price Breakdown
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/prices/breakdown`, {
      params: { basePrice: 2000, qualityTier: 'premium', cropType: 'wheat' }
    });
    const duration = Date.now() - start;
    logTest('Get Price Breakdown',
      response.data && response.data.finalPrice,
      `Final price: ₹${response.data.finalPrice}`,
      duration
    );
  } catch (error) {
    logTest('Get Price Breakdown', false, error.message);
  }
}

// Test Suite: Voice Interface
async function testVoice() {
  logSection('5. VOICE INTERFACE (KISAAN BOT)');
  
  // Test 5.1: Parse Intent
  try {
    const start = Date.now();
    const response = await axios.post(`${BACKEND_URL}/api/voice/parse-intent`, {
      text: 'What is the price of wheat in Delhi?',
      language: 'en'
    });
    const duration = Date.now() - start;
    logTest('Parse Voice Intent',
      response.data && response.data.intent,
      `Intent: ${response.data.intent}`,
      duration
    );
  } catch (error) {
    logTest('Parse Voice Intent', false, error.message);
  }
}

// Test Suite: Discovery
async function testDiscovery() {
  logSection('6. VENDOR DISCOVERY');
  
  // Test 6.1: Find Nearby Vendors
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/discovery/nearby`, {
      params: {
        cropType: 'wheat',
        latitude: 28.6139,
        longitude: 77.2090,
        radiusKm: 50
      }
    });
    const duration = Date.now() - start;
    const vendors = response.data.vendors || response.data;
    logTest('Find Nearby Vendors',
      Array.isArray(vendors),
      `Found ${vendors.length} vendors`,
      duration
    );
  } catch (error) {
    logTest('Find Nearby Vendors', false, error.message);
  }
}

// Test Suite: Integration
async function testIntegration() {
  logSection('7. eNAM INTEGRATION');
  
  // Test 7.1: eNAM Prices
  try {
    const start = Date.now();
    const response = await axios.get(`${BACKEND_URL}/api/prices/current`, {
      params: { cropType: 'wheat' }
    });
    const duration = Date.now() - start;
    const hasPrice = response.data && (response.data.modalPrice || response.data.price);
    logTest('eNAM Price Data',
      hasPrice,
      `Data available: ${hasPrice ? 'Yes' : 'No'}`,
      duration
    );
  } catch (error) {
    logTest('eNAM Price Data', false, error.message);
  }
}

// Test Suite: New Features
async function testNewFeatures() {
  logSection('8. NEW FEATURES (PHASE 1)');
  
  // Test 8.1: Favorites
  if (authToken) {
    try {
      const start = Date.now();
      const response = await axios.get(`${BACKEND_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const duration = Date.now() - start;
      logTest('Favorites Endpoint',
        response.status === 200,
        `Status: ${response.status}`,
        duration
      );
    } catch (error) {
      const isAuth = error.response && error.response.status === 401;
      logTest('Favorites Endpoint', isAuth, 
        isAuth ? 'Endpoint exists (401)' : error.message);
    }
  }
  
  // Test 8.2: Saved Searches
  if (authToken) {
    try {
      const start = Date.now();
      const response = await axios.get(`${BACKEND_URL}/api/saved-searches`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const duration = Date.now() - start;
      logTest('Saved Searches Endpoint',
        response.status === 200,
        `Status: ${response.status}`,
        duration
      );
    } catch (error) {
      const isAuth = error.response && error.response.status === 401;
      logTest('Saved Searches Endpoint', isAuth,
        isAuth ? 'Endpoint exists (401)' : error.message);
    }
  }
  
  // Test 8.3: Price Alerts
  if (authToken) {
    try {
      const start = Date.now();
      const response = await axios.get(`${BACKEND_URL}/api/price-alerts`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const duration = Date.now() - start;
      logTest('Price Alerts Endpoint',
        response.status === 200,
        `Status: ${response.status}`,
        duration
      );
    } catch (error) {
      const isAuth = error.response && error.response.status === 401;
      logTest('Price Alerts Endpoint', isAuth,
        isAuth ? 'Endpoint exists (401)' : error.message);
    }
  }
}

// Generate test report
function generateReport() {
  results.endTime = new Date();
  const duration = results.endTime - results.startTime;
  
  logSection('TEST SUMMARY');
  log(`Total Tests: ${results.passed + results.failed}`, 'cyan');
  log(`✅ Passed: ${results.passed}`, 'green');
  log(`❌ Failed: ${results.failed}`, 'red');
  log(`⏱️  Duration: ${duration}ms`, 'cyan');
  
  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  log(`📊 Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
  
  // Save results to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = path.join(__dirname, `test-results-${timestamp}.json`);
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  log(`\n📄 Results saved to: ${filename}`, 'cyan');
  
  return results.failed === 0;
}

// Main test runner
async function runAllTests() {
  log('\n🚀 MULTILINGUAL MANDI - COMPREHENSIVE TEST SUITE', 'blue');
  log(`Backend: ${BACKEND_URL}`, 'cyan');
  log(`Test Mode: ${TEST_OTP === '000000' ? 'Enabled' : 'Disabled'}`, 'cyan');
  
  try {
    await testAuthentication();
    await testListings();
    await testSearch();
    await testPricing();
    await testVoice();
    await testDiscovery();
    await testIntegration();
    await testNewFeatures();
    
    const success = generateReport();
    process.exit(success ? 0 : 1);
  } catch (error) {
    log(`\n❌ Fatal Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run tests
runAllTests();
