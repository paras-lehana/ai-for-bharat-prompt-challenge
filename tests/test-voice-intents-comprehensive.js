/**
 * Comprehensive Voice Intent Testing Script
 * Tests all intents with various inputs and documents results
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Test configuration
const BACKEND_URL = process.env.BACKEND_URL || 'http://172.18.0.30:5000';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b:free';

// Test cases for all intents
const testCases = [
  // Price Query Tests
  {
    id: 'PQ1',
    intent: 'price_query',
    language: 'Hindi',
    input: 'मुझे गेहूं की कीमत बताओ',
    translation: 'Tell me wheat price',
    expectedIntent: 'price_query',
    expectedParams: { cropType: 'wheat' }
  },
  {
    id: 'PQ2',
    intent: 'price_query',
    language: 'English',
    input: 'What is the price of rice?',
    expectedIntent: 'price_query',
    expectedParams: { cropType: 'rice' }
  },
  {
    id: 'PQ3',
    intent: 'price_query',
    language: 'Hindi',
    input: 'टमाटर कितने का है?',
    translation: 'How much is tomato?',
    expectedIntent: 'price_query',
    expectedParams: { cropType: 'tomato' }
  },
  {
    id: 'PQ4',
    intent: 'price_query',
    language: 'English',
    input: 'Tell me onion prices',
    expectedIntent: 'price_query',
    expectedParams: { cropType: 'onion' }
  },

  // Create Listing Tests
  {
    id: 'CL1',
    intent: 'create_listing',
    language: 'Hindi',
    input: 'मैं 100 किलो टमाटर बेचना चाहता हूं',
    translation: 'I want to sell 100 kg tomatoes',
    expectedIntent: 'create_listing',
    expectedParams: { cropType: 'tomato', quantity: '100 kg' }
  },
  {
    id: 'CL2',
    intent: 'create_listing',
    language: 'English',
    input: 'I want to sell 50 quintal wheat',
    expectedIntent: 'create_listing',
    expectedParams: { cropType: 'wheat', quantity: '50 quintal' }
  },
  {
    id: 'CL3',
    intent: 'create_listing',
    language: 'Hindi',
    input: 'मेरे पास 200 किलो प्याज है बेचने के लिए',
    translation: 'I have 200 kg onions to sell',
    expectedIntent: 'create_listing',
    expectedParams: { cropType: 'onion', quantity: '200 kg' }
  },
  {
    id: 'CL4',
    intent: 'create_listing',
    language: 'English',
    input: 'Selling premium quality rice 100 kg',
    expectedIntent: 'create_listing',
    expectedParams: { cropType: 'rice', quantity: '100 kg', qualityTier: 'premium' }
  },

  // Make Offer Tests
  {
    id: 'MO1',
    intent: 'make_offer',
    language: 'Hindi',
    input: 'मैं 5000 रुपये का ऑफर देना चाहता हूं',
    translation: 'I want to offer 5000 rupees',
    expectedIntent: 'make_offer',
    expectedParams: { price: 5000 }
  },
  {
    id: 'MO2',
    intent: 'make_offer',
    language: 'English',
    input: 'I will pay 3000 for this listing',
    expectedIntent: 'make_offer',
    expectedParams: { price: 3000 }
  },
  {
    id: 'MO3',
    intent: 'make_offer',
    language: 'Hindi',
    input: 'इस लिस्टिंग पर 2500 रुपये दूंगा',
    translation: 'I will give 2500 rupees for this listing',
    expectedIntent: 'make_offer',
    expectedParams: { price: 2500 }
  },

  // Search Listings Tests
  {
    id: 'SL1',
    intent: 'search_listings',
    language: 'Hindi',
    input: 'मुझे प्याज खरीदना है',
    translation: 'I want to buy onions',
    expectedIntent: 'search_listings',
    expectedParams: { cropType: 'onion' }
  },
  {
    id: 'SL2',
    intent: 'search_listings',
    language: 'English',
    input: 'Looking for potatoes',
    expectedIntent: 'search_listings',
    expectedParams: { cropType: 'potato' }
  },
  {
    id: 'SL3',
    intent: 'search_listings',
    language: 'Hindi',
    input: 'गेहूं खोज रहा हूं',
    translation: 'Looking for wheat',
    expectedIntent: 'search_listings',
    expectedParams: { cropType: 'wheat' }
  },
  {
    id: 'SL4',
    intent: 'search_listings',
    language: 'English',
    input: 'Find premium quality tomatoes',
    expectedIntent: 'search_listings',
    expectedParams: { cropType: 'tomato', qualityTier: 'premium' }
  },

  // General Help Tests
  {
    id: 'GH1',
    intent: 'general_help',
    language: 'Hindi',
    input: 'यह कैसे काम करता है?',
    translation: 'How does this work?',
    expectedIntent: 'general_help',
    expectedParams: {}
  },
  {
    id: 'GH2',
    intent: 'general_help',
    language: 'English',
    input: 'I need help',
    expectedIntent: 'general_help',
    expectedParams: {}
  },
  {
    id: 'GH3',
    intent: 'general_help',
    language: 'Hindi',
    input: 'मुझे मदद चाहिए',
    translation: 'I need help',
    expectedIntent: 'general_help',
    expectedParams: {}
  }
];

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  totalTests: testCases.length,
  passed: 0,
  failed: 0,
  tests: []
};

/**
 * Test intent extraction with OpenRouter
 */
async function testIntent(testCase) {
  try {
    console.log(`\n🧪 Testing ${testCase.id}: ${testCase.input}`);
    
    const response = await axios.post(
      `${OPENROUTER_API_URL}/chat/completions`,
      {
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: 'user',
            content: `You are an AI assistant for an agricultural marketplace. Extract intent and parameters from user queries in any Indian language.

Possible intents:
- price_query: User wants to know crop prices
- create_listing: User wants to sell/list a product
- make_offer: User wants to make an offer on a listing
- search_listings: User wants to search/buy products
- general_help: General questions

Extract these parameters if mentioned:
- cropType: Name of the crop in ENGLISH ONLY. Translate Hindi/regional names to English.
- quantity: Amount with unit (e.g., "100 kg", "50 quintal")
- price: Price mentioned (number only, no currency symbols)
- location: Place name
- qualityTier: premium, standard, or basic

CRITICAL TRANSLATION RULES:
- गेहूं → wheat
- चावल → rice
- टमाटर → tomato
- प्याज → onion
- आलू → potato
- कपास → cotton
- गन्ना → sugarcane
- मक्का → maize
- सोयाबीन → soybean
- मूंगफली → groundnut

NEVER return Hindi crop names. ALWAYS translate to English.

Now extract from this query: "${testCase.input}"

Response format (pure JSON only, no markdown):
{"intent":"<intent_type>","cropType":"<crop_name_in_english or null>","quantity":"<quantity or null>","price":"<price or null>","location":"<location or null>","qualityTier":"<tier or null>","confidence":"<high/medium/low>"}`
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://lokalmandi.lehana.in',
          'X-Title': 'Lokal Mandi Test'
        },
        timeout: 15000
      }
    );

    let content = response.data.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    if (content.startsWith('```json')) {
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (content.startsWith('```')) {
      content = content.replace(/```\n?/g, '').trim();
    }
    
    const parsed = JSON.parse(content);
    
    // Check if intent matches
    const intentMatch = parsed.intent === testCase.expectedIntent;
    
    // Check if key parameters match
    let paramsMatch = true;
    const paramIssues = [];
    
    if (testCase.expectedParams.cropType) {
      if (!parsed.cropType || parsed.cropType.toLowerCase() !== testCase.expectedParams.cropType.toLowerCase()) {
        paramsMatch = false;
        paramIssues.push(`cropType: expected "${testCase.expectedParams.cropType}", got "${parsed.cropType}"`);
      }
    }
    
    if (testCase.expectedParams.quantity) {
      if (!parsed.quantity || !parsed.quantity.includes(testCase.expectedParams.quantity.split(' ')[0])) {
        paramsMatch = false;
        paramIssues.push(`quantity: expected "${testCase.expectedParams.quantity}", got "${parsed.quantity}"`);
      }
    }
    
    if (testCase.expectedParams.price) {
      if (!parsed.price || parseInt(parsed.price) !== testCase.expectedParams.price) {
        paramsMatch = false;
        paramIssues.push(`price: expected ${testCase.expectedParams.price}, got ${parsed.price}`);
      }
    }
    
    const passed = intentMatch && paramsMatch;
    
    const result = {
      id: testCase.id,
      intent: testCase.intent,
      language: testCase.language,
      input: testCase.input,
      translation: testCase.translation || testCase.input,
      expectedIntent: testCase.expectedIntent,
      expectedParams: testCase.expectedParams,
      actualIntent: parsed.intent,
      actualParams: {
        cropType: parsed.cropType,
        quantity: parsed.quantity,
        price: parsed.price,
        location: parsed.location,
        qualityTier: parsed.qualityTier
      },
      confidence: parsed.confidence,
      passed,
      intentMatch,
      paramsMatch,
      paramIssues,
      rawResponse: content
    };
    
    if (passed) {
      console.log(`✅ PASS - Intent: ${parsed.intent}, Crop: ${parsed.cropType}`);
      results.passed++;
    } else {
      console.log(`❌ FAIL - Intent: ${parsed.intent}, Crop: ${parsed.cropType}`);
      if (!intentMatch) console.log(`   Intent mismatch: expected "${testCase.expectedIntent}", got "${parsed.intent}"`);
      if (!paramsMatch) console.log(`   Parameter issues: ${paramIssues.join(', ')}`);
      results.failed++;
    }
    
    results.tests.push(result);
    return result;
    
  } catch (error) {
    const errMsg = error.response ? `${error.response.status} - ${JSON.stringify(error.response.data)}` : error.message;
    console.error(`❌ ERROR: ${errMsg}`);
    const result = {
      id: testCase.id,
      intent: testCase.intent,
      language: testCase.language,
      input: testCase.input,
      error: errMsg,
      passed: false
    };
    results.tests.push(result);
    results.failed++;
    return result;
  }
}

/**
 * Generate markdown report
 */
function generateReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(__dirname, `test-results-${timestamp}.md`);
  
  let report = `# Voice Intent Testing Results\n\n`;
  report += `**Date:** ${new Date().toLocaleString()}\n`;
  report += `**Total Tests:** ${results.totalTests}\n`;
  report += `**Passed:** ${results.passed} (${Math.round(results.passed/results.totalTests*100)}%)\n`;
  report += `**Failed:** ${results.failed} (${Math.round(results.failed/results.totalTests*100)}%)\n\n`;
  
  report += `## Summary by Intent\n\n`;
  
  const intentGroups = {};
  results.tests.forEach(test => {
    if (!intentGroups[test.intent]) {
      intentGroups[test.intent] = { total: 0, passed: 0 };
    }
    intentGroups[test.intent].total++;
    if (test.passed) intentGroups[test.intent].passed++;
  });
  
  Object.keys(intentGroups).forEach(intent => {
    const group = intentGroups[intent];
    const percentage = Math.round(group.passed/group.total*100);
    report += `- **${intent}**: ${group.passed}/${group.total} (${percentage}%)\n`;
  });
  
  report += `\n## Detailed Results\n\n`;
  
  results.tests.forEach(test => {
    report += `### Test ${test.id}: ${test.intent}\n\n`;
    report += `**Input (${test.language}):** ${test.input}\n`;
    if (test.translation && test.translation !== test.input) {
      report += `**Translation:** ${test.translation}\n`;
    }
    report += `**Expected Intent:** \`${test.expectedIntent}\`\n`;
    report += `**Actual Intent:** \`${test.actualIntent}\`\n`;
    report += `**Expected Parameters:** \`${JSON.stringify(test.expectedParams)}\`\n`;
    report += `**Actual Parameters:** \`${JSON.stringify(test.actualParams)}\`\n`;
    report += `**Confidence:** ${test.confidence}\n`;
    report += `**Result:** ${test.passed ? '✅ PASS' : '❌ FAIL'}\n`;
    
    if (!test.passed) {
      if (!test.intentMatch) {
        report += `**Issue:** Intent mismatch\n`;
      }
      if (!test.paramsMatch && test.paramIssues) {
        report += `**Parameter Issues:**\n`;
        test.paramIssues.forEach(issue => {
          report += `  - ${issue}\n`;
        });
      }
    }
    
    report += `\n---\n\n`;
  });
  
  report += `## Recommendations\n\n`;
  
  if (results.failed > 0) {
    report += `### Issues Found:\n\n`;
    
    const intentErrors = results.tests.filter(t => !t.intentMatch);
    if (intentErrors.length > 0) {
      report += `1. **Intent Recognition Issues** (${intentErrors.length} cases)\n`;
      intentErrors.forEach(t => {
        report += `   - ${t.id}: "${t.input}" → Expected: ${t.expectedIntent}, Got: ${t.actualIntent}\n`;
      });
      report += `\n`;
    }
    
    const paramErrors = results.tests.filter(t => !t.paramsMatch && t.paramIssues);
    if (paramErrors.length > 0) {
      report += `2. **Parameter Extraction Issues** (${paramErrors.length} cases)\n`;
      paramErrors.forEach(t => {
        report += `   - ${t.id}: ${t.paramIssues.join(', ')}\n`;
      });
      report += `\n`;
    }
    
    report += `### Suggested Improvements:\n\n`;
    report += `1. Add more examples of Hindi crop names in the system prompt\n`;
    report += `2. Improve quantity extraction patterns\n`;
    report += `3. Add context about common Indian agricultural terms\n`;
    report += `4. Consider adding few-shot examples for better accuracy\n`;
  } else {
    report += `All tests passed! The current prompt is working well.\n`;
  }
  
  fs.writeFileSync(reportPath, report);
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  return reportPath;
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('🚀 Starting Comprehensive Voice Intent Testing\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Model: ${OPENROUTER_MODEL}`);
  console.log(`API Key: ${OPENROUTER_API_KEY ? OPENROUTER_API_KEY.substring(0, 15) + '...' : 'NOT SET'}`);
  console.log(`Total Test Cases: ${testCases.length}\n`);
  
  if (!OPENROUTER_API_KEY) {
    console.error('❌ OPENROUTER_API_KEY not set!');
    process.exit(1);
  }
  
  // Run all tests
  for (const testCase of testCases) {
    await testIntent(testCase);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 5000)); // 5s to avoid rate limits on free tier
  }
  
  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.totalTests}`);
  console.log(`Passed: ${results.passed} (${Math.round(results.passed/results.totalTests*100)}%)`);
  console.log(`Failed: ${results.failed} (${Math.round(results.failed/results.totalTests*100)}%)`);
  console.log('='.repeat(60));
  
  const reportPath = generateReport();
  
  // Save JSON results
  const jsonPath = reportPath.replace('.md', '.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`📄 JSON results saved to: ${jsonPath}`);
  
  console.log('\n✅ Testing complete!');
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
