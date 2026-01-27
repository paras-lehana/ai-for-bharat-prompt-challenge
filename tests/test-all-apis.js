/**
 * Comprehensive API Testing Script
 * Tests all backend APIs and frontend functionality
 */

const axios = require('axios');
const fs = require('fs');

const BACKEND_URL = process.env.BACKEND_URL || 'http://172.18.0.30:5000';
const FRONTEND_URL = 'https://lokalmandi.lehana.in';

const results = {
  timestamp: new Date().toISOString(),
  backend: { total: 0, passed: 0, failed: 0, tests: [] },
  frontend: { total: 0, passed: 0, failed: 0, tests: [] }
};

// Test helper
async function testAPI(category, name, testFn) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 ${category.toUpperCase()}: ${name}`);
  console.log(`${'='.repeat(80)}`);
  
  results[category].total++;
  
  try {
    const result = await testFn();
    
    if (result.passed) {
      console.log(`✅ PASS: ${result.message}`);
      results[category].passed++;
    } else {
      console.log(`❌ FAIL: ${result.message}`);
      results[category].failed++;
    }
    
    results[category].tests.push({
      name,
      passed: result.passed,
      message: result.message,
      details: result.details
    });
    
    return result;
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    results[category].failed++;
    results[category].tests.push({
      name,
      passed: false,
      error: error.message
    });
    return { passed: false, message: error.message };
  }
}

// ============================================================================
// BACKEND API TESTS
// ============================================================================

async function testBackendHealth() {
  return testAPI('backend', 'Health Check', async () => {
    const response = await axios.get(`${BACKEND_URL}/health`, { timeout: 5000 });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    
    return {
      passed: response.status === 200,
      message: `Health endpoint returned ${response.status}`,
      details: response.data
    };
  });
}

async function testAuthSendOTP() {
  return testAPI('backend', 'Auth - Send OTP', async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/send-otp`,
      { phoneNumber: '+919876543210' },
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    
    return {
      passed: response.status === 200 && response.data.success,
      message: `OTP sent successfully`,
      details: response.data
    };
  });
}

async function testListingsSearch() {
  return testAPI('backend', 'Listings - Search', async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/listings/search?cropType=wheat`,
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    const listings = response.data.listings || response.data;
    console.log(`   Found: ${listings.length} listings`);
    
    if (listings.length > 0) {
      console.log(`   Sample: ${listings[0].cropType} - ₹${listings[0].finalPrice}/unit`);
    }
    
    return {
      passed: response.status === 200 && Array.isArray(listings) && listings.length > 0,
      message: `Found ${listings.length} wheat listings`,
      details: { count: listings.length, sample: listings[0] }
    };
  });
}

async function testListingsGetAll() {
  return testAPI('backend', 'Listings - Get All (via search)', async () => {
    // Use search without filters to get all listings
    const response = await axios.get(
      `${BACKEND_URL}/api/listings/search`,
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    const listings = response.data.listings || response.data;
    console.log(`   Total Listings: ${listings.length}`);
    
    // Group by crop type
    const byCrop = {};
    listings.forEach(listing => {
      byCrop[listing.cropType] = (byCrop[listing.cropType] || 0) + 1;
    });
    
    console.log(`   Crops Available:`);
    Object.entries(byCrop).forEach(([crop, count]) => {
      console.log(`      - ${crop}: ${count} listings`);
    });
    
    return {
      passed: response.status === 200 && listings.length > 0,
      message: `Found ${listings.length} total listings`,
      details: { total: listings.length, byCrop }
    };
  });
}

async function testVoiceParseIntent() {
  return testAPI('backend', 'Voice - Parse Intent', async () => {
    const testCases = [
      { input: 'मुझे गेहूं की कीमत बताओ', expectedIntent: 'price_query', expectedCrop: 'wheat' },
      { input: 'मैं 100 किलो टमाटर बेचना चाहता हूं', expectedIntent: 'create_listing', expectedCrop: 'tomato' },
      { input: 'मुझे प्याज खरीदना है', expectedIntent: 'search_listings', expectedCrop: 'onion' }
    ];
    
    let allPassed = true;
    const results = [];
    
    for (const testCase of testCases) {
      const response = await axios.post(
        `${BACKEND_URL}/api/voice/parse-intent`,
        { text: testCase.input, languageCode: 'hi' },
        { timeout: 15000 }
      );
      
      const intentMatch = response.data.intent === testCase.expectedIntent;
      const cropMatch = !testCase.expectedCrop || response.data.cropType === testCase.expectedCrop;
      const passed = intentMatch && cropMatch;
      
      console.log(`   Input: "${testCase.input}"`);
      console.log(`   Intent: ${response.data.intent} ${intentMatch ? '✅' : '❌'}`);
      if (testCase.expectedCrop) {
        console.log(`   Crop: ${response.data.cropType} ${cropMatch ? '✅' : '❌'}`);
      }
      console.log();
      
      results.push({ input: testCase.input, passed, intent: response.data.intent, crop: response.data.cropType });
      allPassed = allPassed && passed;
    }
    
    return {
      passed: allPassed,
      message: allPassed ? 'All intent parsing tests passed' : 'Some intent parsing tests failed',
      details: results
    };
  });
}

async function testPricesGetCurrent() {
  return testAPI('backend', 'Prices - Get Current', async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/prices/current?cropType=wheat&location=Delhi`,
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    
    return {
      passed: response.status === 200 && response.data.cropType === 'wheat',
      message: `Got price for wheat in Delhi: ₹${response.data.minPrice}-${response.data.maxPrice}`,
      details: response.data
    };
  });
}

async function testVendorsGetNearby() {
  return testAPI('backend', 'Vendors - Get Nearby', async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/vendors/nearby?lat=28.6139&lng=77.2090&radius=100`,
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Nearby Vendors: ${response.data.length}`);
    
    if (response.data.length > 0) {
      console.log(`   Sample Vendor: ${response.data[0].name} (${response.data[0].location})`);
    }
    
    return {
      passed: response.status === 200,
      message: `Found ${response.data.length} nearby vendors`,
      details: { count: response.data.length }
    };
  });
}

async function testRatingsGetVendor() {
  return testAPI('backend', 'Ratings - Get Vendor Ratings', async () => {
    // First get a vendor ID from listings
    const listingsResponse = await axios.get(
      `${BACKEND_URL}/api/listings/search?cropType=wheat`,
      { timeout: 10000 }
    );
    
    const listings = listingsResponse.data.listings || listingsResponse.data;
    
    if (!listings || listings.length === 0) {
      return {
        passed: false,
        message: 'No listings found to get vendor ID',
        details: {}
      };
    }
    
    const vendorId = listings[0].vendorId;
    console.log(`   Testing with Vendor ID: ${vendorId}`);
    
    const response = await axios.get(
      `${BACKEND_URL}/api/ratings/vendor/${vendorId}`,
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${JSON.stringify(response.data)}`);
    
    return {
      passed: response.status === 200,
      message: `Got ratings for vendor ${vendorId}`,
      details: response.data
    };
  });
}

// ============================================================================
// FRONTEND TESTS
// ============================================================================

async function testFrontendLoads() {
  return testAPI('frontend', 'Homepage Loads', async () => {
    const response = await axios.get(FRONTEND_URL, { 
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    
    console.log(`   Status: ${response.status}`);
    
    const hasTitle = response.data.includes('Lokal Mandi');
    const hasRoot = response.data.includes('id="root"');
    
    console.log(`   Has Title: ${hasTitle ? '✅' : '❌'}`);
    console.log(`   Has Root Div: ${hasRoot ? '✅' : '❌'}`);
    
    return {
      passed: response.status === 200 && hasTitle && hasRoot,
      message: 'Frontend loads successfully',
      details: { hasTitle, hasRoot }
    };
  });
}

async function testFrontendAPIProxy() {
  return testAPI('frontend', 'API Proxy Works', async () => {
    // Test if frontend can proxy to backend
    const response = await axios.get(
      `${FRONTEND_URL}/api/listings/search?cropType=rice`,
      { 
        timeout: 10000,
        headers: { 
          'User-Agent': 'Mozilla/5.0',
          'Origin': FRONTEND_URL
        }
      }
    );
    
    console.log(`   Status: ${response.status}`);
    const listings = response.data.listings || response.data;
    console.log(`   Found: ${listings.length} listings`);
    
    return {
      passed: response.status === 200 && Array.isArray(listings),
      message: `API proxy working - found ${listings.length} listings`,
      details: { count: listings.length }
    };
  });
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('\n🚀 COMPREHENSIVE API TESTING');
  console.log('Testing Backend APIs and Frontend Functionality\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}\n`);
  
  // Backend Tests
  console.log('\n' + '█'.repeat(80));
  console.log('BACKEND API TESTS');
  console.log('█'.repeat(80));
  
  await testBackendHealth();
  await testAuthSendOTP();
  await testListingsSearch();
  await testListingsGetAll();
  await testVoiceParseIntent();
  await testPricesGetCurrent();
  await testVendorsGetNearby();
  await testRatingsGetVendor();
  
  // Frontend Tests
  console.log('\n' + '█'.repeat(80));
  console.log('FRONTEND TESTS');
  console.log('█'.repeat(80));
  
  await testFrontendLoads();
  await testFrontendAPIProxy();
  
  // Summary
  console.log('\n' + '█'.repeat(80));
  console.log('📊 FINAL SUMMARY');
  console.log('█'.repeat(80));
  
  console.log('\n🔧 BACKEND TESTS:');
  console.log(`   Total:  ${results.backend.total}`);
  console.log(`   Passed: ${results.backend.passed} ✅`);
  console.log(`   Failed: ${results.backend.failed} ❌`);
  console.log(`   Rate:   ${Math.round(results.backend.passed/results.backend.total*100)}%`);
  
  console.log('\n🌐 FRONTEND TESTS:');
  console.log(`   Total:  ${results.frontend.total}`);
  console.log(`   Passed: ${results.frontend.passed} ✅`);
  console.log(`   Failed: ${results.frontend.failed} ❌`);
  console.log(`   Rate:   ${Math.round(results.frontend.passed/results.frontend.total*100)}%`);
  
  const totalTests = results.backend.total + results.frontend.total;
  const totalPassed = results.backend.passed + results.frontend.passed;
  const totalFailed = results.backend.failed + results.frontend.failed;
  
  console.log('\n🎯 OVERALL:');
  console.log(`   Total:  ${totalTests}`);
  console.log(`   Passed: ${totalPassed} ✅`);
  console.log(`   Failed: ${totalFailed} ❌`);
  console.log(`   Rate:   ${Math.round(totalPassed/totalTests*100)}%`);
  
  console.log('\n' + '█'.repeat(80));
  
  // Save results
  const reportPath = `test-all-apis-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full results saved to: ${reportPath}\n`);
  
  // Exit with error code if any tests failed
  if (totalFailed > 0) {
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
