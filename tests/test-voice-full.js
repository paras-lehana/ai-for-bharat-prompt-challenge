/**
 * Comprehensive Voice Intent Testing with Full API Integration
 * Tests actual backend API calls and shows complete flow
 */

const axios = require('axios');
const fs = require('fs');

// Configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://172.18.0.30:5000';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Test cases
const testCases = [
  {
    id: 'PQ1',
    input: 'मुझे गेहूं की कीमत बताओ',
    translation: 'Tell me wheat price',
    expectedIntent: 'price_query',
    expectedCrop: 'wheat',
    expectedAPI: 'GET /api/listings/search?cropType=wheat'
  },
  {
    id: 'PQ2',
    input: 'What is the price of rice?',
    translation: 'What is the price of rice?',
    expectedIntent: 'price_query',
    expectedCrop: 'rice',
    expectedAPI: 'GET /api/listings/search?cropType=rice'
  },
  {
    id: 'PQ3',
    input: 'टमाटर कितने का है?',
    translation: 'How much is tomato?',
    expectedIntent: 'price_query',
    expectedCrop: 'tomato',
    expectedAPI: 'GET /api/listings/search?cropType=tomato'
  },
  {
    id: 'CL1',
    input: 'मैं 100 किलो टमाटर बेचना चाहता हूं',
    translation: 'I want to sell 100 kg tomatoes',
    expectedIntent: 'create_listing',
    expectedCrop: 'tomato',
    expectedQuantity: '100 kg',
    expectedAPI: 'POST /api/listings'
  },
  {
    id: 'MO1',
    input: 'मैं 5000 रुपये का ऑफर देना चाहता हूं',
    translation: 'I want to offer 5000 rupees',
    expectedIntent: 'make_offer',
    expectedPrice: '5000',
    expectedAPI: 'POST /api/negotiations'
  },
  {
    id: 'SL1',
    input: 'मुझे प्याज खरीदना है',
    translation: 'I want to buy onions',
    expectedIntent: 'search_listings',
    expectedCrop: 'onion',
    expectedAPI: 'GET /api/listings/search?cropType=onion'
  },
  {
    id: 'SL2',
    input: 'गेहूं खोज रहा हूं',
    translation: 'Looking for wheat',
    expectedIntent: 'search_listings',
    expectedCrop: 'wheat',
    expectedAPI: 'GET /api/listings/search?cropType=wheat'
  },
  {
    id: 'GH1',
    input: 'यह कैसे काम करता है?',
    translation: 'How does this work?',
    expectedIntent: 'general_help',
    expectedAPI: 'None (help response)'
  }
];

const results = {
  timestamp: new Date().toISOString(),
  totalTests: testCases.length,
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test voice query through backend API
 */
async function testVoiceQuery(testCase) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`🧪 TEST ${testCase.id}`);
  console.log(`${'='.repeat(80)}`);
  console.log(`📝 Input (Hindi):     ${testCase.input}`);
  console.log(`📝 Translation:       ${testCase.translation}`);
  console.log(`🎯 Expected Intent:   ${testCase.expectedIntent}`);
  if (testCase.expectedCrop) console.log(`🌾 Expected Crop:     ${testCase.expectedCrop}`);
  if (testCase.expectedQuantity) console.log(`📦 Expected Quantity: ${testCase.expectedQuantity}`);
  if (testCase.expectedPrice) console.log(`💰 Expected Price:    ${testCase.expectedPrice}`);
  console.log(`🔗 Expected API:      ${testCase.expectedAPI}`);
  console.log();

  try {
    // Step 1: Call backend voice query endpoint
    console.log(`⏳ Step 1: Calling backend /api/voice/parse-intent...`);
    const voiceResponse = await axios.post(
      `${BACKEND_URL}/api/voice/parse-intent`,
      {
        text: testCase.input,
        languageCode: 'hi'
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const intentData = voiceResponse.data;
    console.log(`✅ Backend Response:`);
    console.log(`   Intent:     ${intentData.intent}`);
    console.log(`   Crop Type:  ${intentData.cropType || 'null'}`);
    console.log(`   Quantity:   ${intentData.quantity || 'null'}`);
    console.log(`   Price:      ${intentData.price || 'null'}`);
    console.log(`   Confidence: ${intentData.confidence}`);
    console.log();

    // Step 2: Verify intent matches
    const intentMatch = intentData.intent === testCase.expectedIntent;
    console.log(`${intentMatch ? '✅' : '❌'} Intent Match: ${intentData.intent} ${intentMatch ? '==' : '!='} ${testCase.expectedIntent}`);

    // Step 3: Verify crop translation (if applicable)
    let cropMatch = true;
    if (testCase.expectedCrop) {
      cropMatch = intentData.cropType && intentData.cropType.toLowerCase() === testCase.expectedCrop.toLowerCase();
      console.log(`${cropMatch ? '✅' : '❌'} Crop Translation: ${intentData.cropType} ${cropMatch ? '==' : '!='} ${testCase.expectedCrop}`);
      
      if (!cropMatch && intentData.cropType) {
        console.log(`   ⚠️  TRANSLATION ERROR: Got "${intentData.cropType}" instead of "${testCase.expectedCrop}"`);
      }
    }

    // Step 4: Try to call the actual API endpoint
    let apiCallSuccess = false;
    let apiResponse = null;
    console.log();
    console.log(`⏳ Step 2: Testing actual API call...`);

    try {
      if (intentData.intent === 'price_query' || intentData.intent === 'search_listings') {
        if (intentData.cropType) {
          const searchUrl = `${BACKEND_URL}/api/listings/search?cropType=${intentData.cropType}`;
          console.log(`   Calling: GET ${searchUrl}`);
          apiResponse = await axios.get(searchUrl, { timeout: 10000 });
          apiCallSuccess = true;
          console.log(`   ✅ API Success: Found ${apiResponse.data.length} listings`);
          if (apiResponse.data.length > 0) {
            console.log(`   📊 Sample: ${apiResponse.data[0].cropType} - ₹${apiResponse.data[0].pricePerUnit}/unit`);
          }
        } else {
          console.log(`   ⚠️  Cannot call API: cropType is null`);
        }
      } else if (intentData.intent === 'general_help') {
        console.log(`   ℹ️  General help - no API call needed`);
        apiCallSuccess = true;
      } else {
        console.log(`   ℹ️  Intent "${intentData.intent}" requires authentication/context - skipping API test`);
        apiCallSuccess = true; // Don't fail for intents that need auth
      }
    } catch (apiError) {
      console.log(`   ❌ API Call Failed: ${apiError.message}`);
    }

    // Final result
    const passed = intentMatch && cropMatch && apiCallSuccess;
    console.log();
    console.log(`${passed ? '✅ TEST PASSED' : '❌ TEST FAILED'}`);

    results.tests.push({
      id: testCase.id,
      input: testCase.input,
      translation: testCase.translation,
      expectedIntent: testCase.expectedIntent,
      expectedCrop: testCase.expectedCrop,
      actualIntent: intentData.intent,
      actualCrop: intentData.cropType,
      intentMatch,
      cropMatch,
      apiCallSuccess,
      apiResultCount: apiResponse ? apiResponse.data.length : null,
      passed
    });

    if (passed) {
      results.passed++;
    } else {
      results.failed++;
    }

  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    
    results.tests.push({
      id: testCase.id,
      input: testCase.input,
      error: error.message,
      passed: false
    });
    results.failed++;
  }
}

/**
 * Generate detailed report
 */
function generateReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = `test-results-full-${timestamp}.md`;
  
  let report = `# Comprehensive Voice Intent Testing Results\n\n`;
  report += `**Date:** ${new Date().toLocaleString()}\n`;
  report += `**Backend URL:** ${BACKEND_URL}\n`;
  report += `**Total Tests:** ${results.totalTests}\n`;
  report += `**Passed:** ${results.passed} ✅\n`;
  report += `**Failed:** ${results.failed} ❌\n`;
  report += `**Success Rate:** ${Math.round(results.passed/results.totalTests*100)}%\n\n`;
  
  report += `## Test Results\n\n`;
  
  results.tests.forEach(test => {
    report += `### ${test.id}: ${test.passed ? '✅ PASS' : '❌ FAIL'}\n\n`;
    report += `**Input:** ${test.input}\n`;
    report += `**Translation:** ${test.translation}\n`;
    
    if (test.error) {
      report += `**Error:** ${test.error}\n\n`;
    } else {
      report += `**Expected Intent:** ${test.expectedIntent}\n`;
      report += `**Actual Intent:** ${test.actualIntent} ${test.intentMatch ? '✅' : '❌'}\n`;
      
      if (test.expectedCrop) {
        report += `**Expected Crop:** ${test.expectedCrop}\n`;
        report += `**Actual Crop:** ${test.actualCrop} ${test.cropMatch ? '✅' : '❌'}\n`;
        
        if (!test.cropMatch) {
          report += `**⚠️ TRANSLATION ISSUE:** Hindi crop name not translated to English!\n`;
        }
      }
      
      report += `**API Call:** ${test.apiCallSuccess ? '✅ Success' : '❌ Failed'}\n`;
      if (test.apiResultCount !== null) {
        report += `**API Results:** ${test.apiResultCount} listings found\n`;
      }
    }
    
    report += `\n---\n\n`;
  });
  
  // Issues summary
  const translationIssues = results.tests.filter(t => !t.cropMatch && t.expectedCrop);
  const intentIssues = results.tests.filter(t => !t.intentMatch);
  const apiIssues = results.tests.filter(t => !t.apiCallSuccess && !t.error);
  
  if (translationIssues.length > 0 || intentIssues.length > 0 || apiIssues.length > 0) {
    report += `## Issues Found\n\n`;
    
    if (translationIssues.length > 0) {
      report += `### 🔴 Translation Issues (${translationIssues.length})\n\n`;
      translationIssues.forEach(t => {
        report += `- **${t.id}**: "${t.input}" → Expected "${t.expectedCrop}", Got "${t.actualCrop}"\n`;
      });
      report += `\n**Root Cause:** LLM not translating Hindi crop names to English\n`;
      report += `**Fix:** Add few-shot examples or stronger translation rules in system prompt\n\n`;
    }
    
    if (intentIssues.length > 0) {
      report += `### 🔴 Intent Recognition Issues (${intentIssues.length})\n\n`;
      intentIssues.forEach(t => {
        report += `- **${t.id}**: Expected "${t.expectedIntent}", Got "${t.actualIntent}"\n`;
      });
      report += `\n`;
    }
    
    if (apiIssues.length > 0) {
      report += `### 🔴 API Call Issues (${apiIssues.length})\n\n`;
      apiIssues.forEach(t => {
        report += `- **${t.id}**: API call failed\n`;
      });
      report += `\n`;
    }
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  return reportPath;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('\n🚀 COMPREHENSIVE VOICE INTENT TESTING');
  console.log('Testing full flow: Voice Input → Intent Extraction → API Call\n');
  console.log(`Backend: ${BACKEND_URL}`);
  console.log(`Total Tests: ${testCases.length}\n`);
  
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY not set!');
    process.exit(1);
  }
  
  // Run all tests
  for (const testCase of testCases) {
    await testVoiceQuery(testCase);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Delay between tests
  }
  
  // Summary
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 FINAL SUMMARY');
  console.log(`${'='.repeat(80)}`);
  console.log(`Total Tests:  ${results.totalTests}`);
  console.log(`Passed:       ${results.passed} ✅ (${Math.round(results.passed/results.totalTests*100)}%)`);
  console.log(`Failed:       ${results.failed} ❌ (${Math.round(results.failed/results.totalTests*100)}%)`);
  console.log(`${'='.repeat(80)}\n`);
  
  generateReport();
  
  console.log('✅ Testing complete!\n');
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
