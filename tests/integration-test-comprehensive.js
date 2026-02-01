/**
 * Comprehensive Integration Testing Script
 * Tests all API endpoints, error handling, edge cases, and database integrity
 */

const axios = require('axios');
const fs = require('fs');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

const results = {
  timestamp: new Date().toISOString(),
  categories: {
    authentication: { total: 0, passed: 0, failed: 0, tests: [] },
    listings: { total: 0, passed: 0, failed: 0, tests: [] },
    negotiations: { total: 0, passed: 0, failed: 0, tests: [] },
    transactions: { total: 0, passed: 0, failed: 0, tests: [] },
    voice: { total: 0, passed: 0, failed: 0, tests: [] },
    prices: { total: 0, passed: 0, failed: 0, tests: [] },
    ratings: { total: 0, passed: 0, failed: 0, tests: [] },
    errorHandling: { total: 0, passed: 0, failed: 0, tests: [] },
    edgeCases: { total: 0, passed: 0, failed: 0, tests: [] },
    database: { total: 0, passed: 0, failed: 0, tests: [] }
  }
};

// Test helper
async function testAPI(category, name, testFn) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 ${category.toUpperCase()}: ${name}`);
  console.log(`${'='.repeat(80)}`);
  
  results.categories[category].total++;
  
  try {
    const result = await testFn();
    
    if (result.passed) {
      console.log(`✅ PASS: ${result.message}`);
      results.categories[category].passed++;
    } else {
      console.log(`❌ FAIL: ${result.message}`);
      results.categories[category].failed++;
    }
    
    results.categories[category].tests.push({
      name,
      passed: result.passed,
      message: result.message,
      details: result.details
    });
    
    return result;
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    results.categories[category].failed++;
    results.categories[category].tests.push({
      name,
      passed: false,
      error: error.message
    });
    return { passed: false, message: error.message };
  }
}

// ============================================================================
// AUTHENTICATION TESTS
// ============================================================================

async function testAuthSendOTP() {
  return testAPI('authentication', 'Send OTP - Valid Phone', async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/auth/send-otp`,
      { phoneNumber: '+919876543210' },
      { timeout: 10000 }
    );
    
    console.log(`   Status: ${response.status}`);
    console.log(`   OTP: ${response.data.otp}`);
    
    return {
      passed: response.status === 200 && response.data.success,
      message: `OTP sent successfully`,
      details: response.data
    };
  });
}

async function testAuthInvalidPhone() {
  return testAPI('authentication', 'Send OTP - Invalid Phone', async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/send-otp`,
        { phoneNumber: 'invalid' },
        { timeout: 10000 }
      );
      return { passed: false, message: 'Should have rejected invalid phone' };
    } catch (error) {
      console.log(`   Status: ${error.response?.status}`);
      return {
        passed: error.response?.status === 400,
        message: 'Correctly rejected invalid phone number',
        details: error.response?.data
      };
    }
  });
}

async function testAuthVerifyOTP() {
  return testAPI('authentication', 'Verify OTP - Valid', async () => {
    // First send OTP
    const sendResponse = await axios.post(
      `${BACKEND_URL}/api/auth/send-otp`,
      { phoneNumber: '+919876543210' }
    );
    
    const otp = sendResponse.data.otp;
    
    // Then verify
    const verifyResponse = await axios.post(
      `${BACKEND_URL}/api/auth/verify-otp`,
      { phoneNumber: '+919876543210', otp }
    );
    
    console.log(`   Status: ${verifyResponse.status}`);
    console.log(`   Token received: ${!!verifyResponse.data.token}`);
    
    return {
      passed: verifyResponse.status === 200 && !!verifyResponse.data.token,
      message: 'OTP verified successfully',
      details: { hasToken: !!verifyResponse.data.token }
    };
  });
}

// ============================================================================
// LISTINGS TESTS
// ============================================================================

async function testListingsSearch() {
  return testAPI('listings', 'Search - By Crop Type', async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/listings/search?cropType=wheat`,
      { timeout: 10000 }
    );
    
    const listings = response.data.listings || response.data;
    console.log(`   Found: ${listings.length} wheat listings`);
    
    return {
      passed: response.status === 200 && listings.length > 0,
      message: `Found ${listings.length} wheat listings`,
      details: { count: listings.length }
    };
  });
}

async function testListingsSearchEmpty() {
  return testAPI('listings', 'Search - No Results', async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/listings/search?cropType=nonexistent`,
      { timeout: 10000 }
    );
    
    const listings = response.data.listings || response.data;
    console.log(`   Found: ${listings.length} listings`);
    
    return {
      passed: response.status === 200 && listings.length === 0,
      message: 'Correctly returned empty results',
      details: { count: listings.length }
    };
  });
}

async function testListingsGetById() {
  return testAPI('listings', 'Get By ID - Valid', async () => {
    // First get a listing ID
    const searchResponse = await axios.get(
      `${BACKEND_URL}/api/listings/search?cropType=wheat`
    );
    
    const listings = searchResponse.data.listings || searchResponse.data;
    if (listings.length === 0) {
      return { passed: false, message: 'No listings to test with' };
    }
    
    const listingId = listings[0].id;
    
    // Then get by ID
    const response = await axios.get(
      `${BACKEND_URL}/api/listings/${listingId}`
    );
    
    console.log(`   Listing: ${response.data.cropType} - ₹${response.data.finalPrice}`);
    
    return {
      passed: response.status === 200 && response.data.id === listingId,
      message: 'Retrieved listing by ID',
      details: response.data
    };
  });
}

// ============================================================================
// VOICE INTERFACE TESTS
// ============================================================================

async function testVoiceParseIntent() {
  return testAPI('voice', 'Parse Intent - Price Query', async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/voice/parse-intent`,
      { text: 'What is the price of wheat?', languageCode: 'en' },
      { timeout: 15000 }
    );
    
    console.log(`   Intent: ${response.data.intent}`);
    console.log(`   Crop: ${response.data.cropType}`);
    
    return {
      passed: response.status === 200 && response.data.cropType === 'wheat',
      message: `Parsed intent: ${response.data.intent}`,
      details: response.data
    };
  });
}

async function testVoiceParseCreateListing() {
  return testAPI('voice', 'Parse Intent - Create Listing', async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/voice/parse-intent`,
      { text: 'I want to sell 100 kg of tomatoes', languageCode: 'en' },
      { timeout: 15000 }
    );
    
    console.log(`   Intent: ${response.data.intent}`);
    console.log(`   Crop: ${response.data.cropType}`);
    console.log(`   Quantity: ${response.data.quantity}`);
    
    return {
      passed: response.status === 200 && 
              response.data.intent === 'create_listing' &&
              response.data.cropType === 'tomato',
      message: `Parsed create listing intent`,
      details: response.data
    };
  });
}

// ============================================================================
// PRICES TESTS
// ============================================================================

async function testPricesGetCurrent() {
  return testAPI('prices', 'Get Current Price - Valid Crop', async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/prices/current?cropType=wheat&location=Delhi`,
      { timeout: 10000 }
    );
    
    console.log(`   Price Range: ₹${response.data.minPrice} - ₹${response.data.maxPrice}`);
    console.log(`   Source: ${response.data.source}`);
    
    return {
      passed: response.status === 200 && response.data.cropType === 'wheat',
      message: `Got price for wheat`,
      details: response.data
    };
  });
}

async function testPricesMultipleCrops() {
  return testAPI('prices', 'Get Prices - Multiple Crops', async () => {
    const crops = ['wheat', 'rice', 'maize', 'cotton', 'onion'];
    const results = [];
    
    for (const crop of crops) {
      const response = await axios.get(
        `${BACKEND_URL}/api/prices/current?cropType=${crop}&location=Delhi`
      );
      results.push({
        crop,
        price: response.data.modalPrice,
        source: response.data.source
      });
      console.log(`   ${crop}: ₹${response.data.modalPrice} (${response.data.source})`);
    }
    
    return {
      passed: results.length === crops.length,
      message: `Retrieved prices for ${results.length} crops`,
      details: results
    };
  });
}

// ============================================================================
// ERROR HANDLING TESTS
// ============================================================================

async function testErrorHandling404() {
  return testAPI('errorHandling', '404 - Invalid Endpoint', async () => {
    try {
      await axios.get(`${BACKEND_URL}/api/nonexistent`);
      return { passed: false, message: 'Should have returned 404' };
    } catch (error) {
      console.log(`   Status: ${error.response?.status}`);
      return {
        passed: error.response?.status === 404,
        message: 'Correctly returned 404',
        details: error.response?.data
      };
    }
  });
}

async function testErrorHandlingMissingParams() {
  return testAPI('errorHandling', 'Missing Required Parameters', async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {});
      return { passed: false, message: 'Should have rejected missing params' };
    } catch (error) {
      console.log(`   Status: ${error.response?.status}`);
      return {
        passed: error.response?.status === 400,
        message: 'Correctly rejected missing parameters',
        details: error.response?.data
      };
    }
  });
}

async function testErrorHandlingInvalidData() {
  return testAPI('errorHandling', 'Invalid Data Types', async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
        phoneNumber: 12345 // Should be string
      });
      return { passed: false, message: 'Should have rejected invalid data type' };
    } catch (error) {
      console.log(`   Status: ${error.response?.status}`);
      return {
        passed: error.response?.status === 400,
        message: 'Correctly rejected invalid data type',
        details: error.response?.data
      };
    }
  });
}

// ============================================================================
// EDGE CASES TESTS
// ============================================================================

async function testEdgeCasesLargeQuery() {
  return testAPI('edgeCases', 'Large Query String', async () => {
    const longText = 'a'.repeat(1000);
    const response = await axios.post(
      `${BACKEND_URL}/api/voice/parse-intent`,
      { text: longText, languageCode: 'en' },
      { timeout: 15000 }
    );
    
    console.log(`   Handled ${longText.length} character input`);
    
    return {
      passed: response.status === 200,
      message: 'Handled large query string',
      details: { length: longText.length }
    };
  });
}

async function testEdgeCasesSpecialCharacters() {
  return testAPI('edgeCases', 'Special Characters in Input', async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/voice/parse-intent`,
      { text: 'Price of wheat? @#$%^&*()', languageCode: 'en' },
      { timeout: 15000 }
    );
    
    console.log(`   Intent: ${response.data.intent}`);
    
    return {
      passed: response.status === 200,
      message: 'Handled special characters',
      details: response.data
    };
  });
}

async function testEdgeCasesConcurrentRequests() {
  return testAPI('edgeCases', 'Concurrent Requests', async () => {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(
        axios.get(`${BACKEND_URL}/api/listings/search?cropType=wheat`)
      );
    }
    
    const responses = await Promise.all(requests);
    const allSuccessful = responses.every(r => r.status === 200);
    
    console.log(`   Completed ${responses.length} concurrent requests`);
    
    return {
      passed: allSuccessful,
      message: `Handled ${responses.length} concurrent requests`,
      details: { count: responses.length }
    };
  });
}

// ============================================================================
// DATABASE INTEGRITY TESTS
// ============================================================================

async function testDatabaseIntegrity() {
  return testAPI('database', 'Data Consistency', async () => {
    // Get all listings
    const listingsResponse = await axios.get(
      `${BACKEND_URL}/api/listings/search`
    );
    const listings = listingsResponse.data.listings || listingsResponse.data;
    
    // Check each listing has required fields
    const issues = [];
    for (const listing of listings) {
      if (!listing.id) issues.push('Missing ID');
      if (!listing.cropType) issues.push('Missing cropType');
      if (!listing.vendorId) issues.push('Missing vendorId');
      if (listing.finalPrice === undefined) issues.push('Missing finalPrice');
    }
    
    console.log(`   Checked ${listings.length} listings`);
    console.log(`   Issues found: ${issues.length}`);
    
    return {
      passed: issues.length === 0,
      message: issues.length === 0 ? 'All data consistent' : `Found ${issues.length} issues`,
      details: { listings: listings.length, issues }
    };
  });
}

async function testDatabaseRelationships() {
  return testAPI('database', 'Foreign Key Relationships', async () => {
    // Get a listing with vendor info
    const listingsResponse = await axios.get(
      `${BACKEND_URL}/api/listings/search?cropType=wheat`
    );
    const listings = listingsResponse.data.listings || listingsResponse.data;
    
    if (listings.length === 0) {
      return { passed: false, message: 'No listings to test' };
    }
    
    const listing = listings[0];
    
    // Check if vendor info is included
    const hasVendorInfo = listing.vendor || listing.vendorId;
    
    console.log(`   Listing has vendor info: ${!!hasVendorInfo}`);
    
    return {
      passed: !!hasVendorInfo,
      message: 'Foreign key relationships working',
      details: { hasVendorInfo }
    };
  });
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runAllTests() {
  console.log('\n🚀 COMPREHENSIVE INTEGRATION TESTING');
  console.log('Testing all APIs, error handling, edge cases, and database integrity\n');
  console.log(`Backend URL: ${BACKEND_URL}\n`);
  
  // Authentication Tests
  console.log('\n' + '█'.repeat(80));
  console.log('AUTHENTICATION TESTS');
  console.log('█'.repeat(80));
  await testAuthSendOTP();
  await testAuthInvalidPhone();
  await testAuthVerifyOTP();
  
  // Listings Tests
  console.log('\n' + '█'.repeat(80));
  console.log('LISTINGS TESTS');
  console.log('█'.repeat(80));
  await testListingsSearch();
  await testListingsSearchEmpty();
  await testListingsGetById();
  
  // Voice Interface Tests
  console.log('\n' + '█'.repeat(80));
  console.log('VOICE INTERFACE TESTS');
  console.log('█'.repeat(80));
  await testVoiceParseIntent();
  await testVoiceParseCreateListing();
  
  // Prices Tests
  console.log('\n' + '█'.repeat(80));
  console.log('PRICES TESTS');
  console.log('█'.repeat(80));
  await testPricesGetCurrent();
  await testPricesMultipleCrops();
  
  // Error Handling Tests
  console.log('\n' + '█'.repeat(80));
  console.log('ERROR HANDLING TESTS');
  console.log('█'.repeat(80));
  await testErrorHandling404();
  await testErrorHandlingMissingParams();
  await testErrorHandlingInvalidData();
  
  // Edge Cases Tests
  console.log('\n' + '█'.repeat(80));
  console.log('EDGE CASES TESTS');
  console.log('█'.repeat(80));
  await testEdgeCasesLargeQuery();
  await testEdgeCasesSpecialCharacters();
  await testEdgeCasesConcurrentRequests();
  
  // Database Integrity Tests
  console.log('\n' + '█'.repeat(80));
  console.log('DATABASE INTEGRITY TESTS');
  console.log('█'.repeat(80));
  await testDatabaseIntegrity();
  await testDatabaseRelationships();
  
  // Summary
  console.log('\n' + '█'.repeat(80));
  console.log('📊 FINAL SUMMARY');
  console.log('█'.repeat(80));
  
  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [category, data] of Object.entries(results.categories)) {
    if (data.total > 0) {
      console.log(`\n📦 ${category.toUpperCase()}:`);
      console.log(`   Total:  ${data.total}`);
      console.log(`   Passed: ${data.passed} ✅`);
      console.log(`   Failed: ${data.failed} ❌`);
      console.log(`   Rate:   ${Math.round(data.passed/data.total*100)}%`);
      
      totalTests += data.total;
      totalPassed += data.passed;
      totalFailed += data.failed;
    }
  }
  
  console.log('\n🎯 OVERALL:');
  console.log(`   Total:  ${totalTests}`);
  console.log(`   Passed: ${totalPassed} ✅`);
  console.log(`   Failed: ${totalFailed} ❌`);
  console.log(`   Rate:   ${Math.round(totalPassed/totalTests*100)}%`);
  
  console.log('\n' + '█'.repeat(80));
  
  // Save results
  const reportPath = `tests/integration-test-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full results saved to: ${reportPath}\n`);
  
  // Exit with error code if any tests failed
  if (totalFailed > 0) {
    console.log(`⚠️  ${totalFailed} test(s) failed. Review the results above.\n`);
    process.exit(1);
  } else {
    console.log(`✅ All tests passed!\n`);
    process.exit(0);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
