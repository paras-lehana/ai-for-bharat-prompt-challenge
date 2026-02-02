#!/usr/bin/env node

/**
 * Comprehensive Test Script for Price Alerts Feature (Task 57)
 * 
 * Tests:
 * 1. Backend API endpoints (CRUD operations)
 * 2. Alert triggering logic
 * 3. Price checking service
 * 4. Frontend component rendering
 * 5. Alert management workflows
 */

const axios = require('axios');
const fs = require('fs');

const API_URL = process.env.API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to log test results
function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (details) console.log(`   ${details}`);
  
  results.tests.push({ name, passed, details });
  if (passed) results.passed++;
  else results.failed++;
}

// Helper function to make authenticated requests
async function makeAuthRequest(method, endpoint, data = null, token = null) {
  try {
    const config = {
      method,
      url: `${API_URL}${endpoint}`,
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status 
    };
  }
}

// Test 1: Create test user and get token
async function testAuthentication() {
  console.log('\n📝 Test 1: Authentication');
  
  const testPhone = `+91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  
  // Send OTP
  const otpResult = await makeAuthRequest('POST', '/api/auth/send-otp', { phone: testPhone });
  logTest('Send OTP', otpResult.success, otpResult.success ? 'OTP sent successfully' : otpResult.error);
  
  if (!otpResult.success) return null;
  
  // For testing, we'll use a mock OTP verification
  // In production, you'd need to get the actual OTP from the database or SMS
  const verifyResult = await makeAuthRequest('POST', '/api/auth/verify-otp', { 
    phone: testPhone, 
    otp: '123456' // Mock OTP
  });
  
  if (verifyResult.success) {
    logTest('Verify OTP and get token', true, 'Token received');
    return verifyResult.data.token;
  } else {
    // Try to login with existing user
    logTest('Verify OTP', false, 'Using mock authentication for testing');
    // Return a mock token for testing purposes
    return 'mock-token-for-testing';
  }
}

// Test 2: Create Price Alert
async function testCreateAlert(token) {
  console.log('\n📝 Test 2: Create Price Alert');
  
  const alertData = {
    cropType: 'Wheat',
    targetPrice: 2000,
    alertType: 'below',
    location: 'Mumbai, Maharashtra',
    notificationMethod: 'in-app'
  };
  
  const result = await makeAuthRequest('POST', '/api/price-alerts', alertData, token);
  logTest('Create price alert', result.success, 
    result.success ? `Alert created with ID: ${result.data.id}` : result.error);
  
  return result.success ? result.data.id : null;
}

// Test 3: Get All Alerts
async function testGetAlerts(token) {
  console.log('\n📝 Test 3: Get All Price Alerts');
  
  const result = await makeAuthRequest('GET', '/api/price-alerts', null, token);
  logTest('Get all alerts', result.success, 
    result.success ? `Found ${result.data.length} alerts` : result.error);
  
  return result.success ? result.data : [];
}

// Test 4: Get Single Alert
async function testGetSingleAlert(token, alertId) {
  console.log('\n📝 Test 4: Get Single Price Alert');
  
  if (!alertId) {
    logTest('Get single alert', false, 'No alert ID provided');
    return;
  }
  
  const result = await makeAuthRequest('GET', `/api/price-alerts/${alertId}`, null, token);
  logTest('Get single alert', result.success, 
    result.success ? `Alert details retrieved` : result.error);
}

// Test 5: Update Alert
async function testUpdateAlert(token, alertId) {
  console.log('\n📝 Test 5: Update Price Alert');
  
  if (!alertId) {
    logTest('Update alert', false, 'No alert ID provided');
    return;
  }
  
  const updateData = {
    targetPrice: 2500,
    alertType: 'above'
  };
  
  const result = await makeAuthRequest('PUT', `/api/price-alerts/${alertId}`, updateData, token);
  logTest('Update alert', result.success, 
    result.success ? 'Alert updated successfully' : result.error);
}

// Test 6: Get Active Alerts
async function testGetActiveAlerts(token) {
  console.log('\n📝 Test 6: Get Active Price Alerts');
  
  const result = await makeAuthRequest('GET', '/api/price-alerts/active', null, token);
  logTest('Get active alerts', result.success, 
    result.success ? `Found ${result.data.length} active alerts` : result.error);
}

// Test 7: Check Alerts (Manual Trigger)
async function testCheckAlerts(token) {
  console.log('\n📝 Test 7: Check Alerts (Manual Trigger)');
  
  const result = await makeAuthRequest('POST', '/api/price-alerts/check', null, token);
  logTest('Check alerts', result.success, 
    result.success ? `Checked ${result.data.checked} alerts, triggered ${result.data.triggered}` : result.error);
}

// Test 8: Get Notifications
async function testGetNotifications(token) {
  console.log('\n📝 Test 8: Get Triggered Alert Notifications');
  
  const result = await makeAuthRequest('GET', '/api/price-alerts/notifications', null, token);
  logTest('Get notifications', result.success, 
    result.success ? `Found ${result.data.length} notifications` : result.error);
}

// Test 9: Delete Alert
async function testDeleteAlert(token, alertId) {
  console.log('\n📝 Test 9: Delete Price Alert');
  
  if (!alertId) {
    logTest('Delete alert', false, 'No alert ID provided');
    return;
  }
  
  const result = await makeAuthRequest('DELETE', `/api/price-alerts/${alertId}`, null, token);
  logTest('Delete alert', result.success, 
    result.success ? 'Alert deleted successfully' : result.error);
}

// Test 10: Validation Tests
async function testValidation(token) {
  console.log('\n📝 Test 10: Input Validation');
  
  // Test missing required fields
  const result1 = await makeAuthRequest('POST', '/api/price-alerts', {}, token);
  logTest('Reject missing required fields', !result1.success && result1.status === 400, 
    'Validation error returned');
  
  // Test invalid alert type
  const result2 = await makeAuthRequest('POST', '/api/price-alerts', {
    cropType: 'Wheat',
    targetPrice: 2000,
    alertType: 'invalid'
  }, token);
  logTest('Reject invalid alert type', !result2.success && result2.status === 400, 
    'Validation error returned');
  
  // Test negative price
  const result3 = await makeAuthRequest('POST', '/api/price-alerts', {
    cropType: 'Wheat',
    targetPrice: -100,
    alertType: 'below'
  }, token);
  logTest('Reject negative price', !result3.success && result3.status === 400, 
    'Validation error returned');
}

// Test 11: Frontend Component Test
async function testFrontendComponent() {
  console.log('\n📝 Test 11: Frontend Component Rendering');
  
  try {
    const response = await axios.get(FRONTEND_URL);
    const html = response.data;
    
    // Check if the app loads
    logTest('Frontend loads', response.status === 200, 'Frontend is accessible');
    
    // Check if React app is present
    const hasReactRoot = html.includes('root') || html.includes('app');
    logTest('React app present', hasReactRoot, 'React root element found');
    
  } catch (error) {
    logTest('Frontend loads', false, `Frontend not accessible: ${error.message}`);
  }
}

// Test 12: Alert Type Tests
async function testAlertTypes(token) {
  console.log('\n📝 Test 12: Alert Type Tests');
  
  // Test "below" alert
  const belowAlert = await makeAuthRequest('POST', '/api/price-alerts', {
    cropType: 'Rice',
    targetPrice: 1800,
    alertType: 'below'
  }, token);
  logTest('Create "below" alert', belowAlert.success, 
    belowAlert.success ? 'Below alert created' : belowAlert.error);
  
  // Test "above" alert
  const aboveAlert = await makeAuthRequest('POST', '/api/price-alerts', {
    cropType: 'Maize',
    targetPrice: 2200,
    alertType: 'above'
  }, token);
  logTest('Create "above" alert', aboveAlert.success, 
    aboveAlert.success ? 'Above alert created' : aboveAlert.error);
  
  // Clean up
  if (belowAlert.success) {
    await makeAuthRequest('DELETE', `/api/price-alerts/${belowAlert.data.id}`, null, token);
  }
  if (aboveAlert.success) {
    await makeAuthRequest('DELETE', `/api/price-alerts/${aboveAlert.data.id}`, null, token);
  }
}

// Test 13: Multiple Alerts for Same Crop
async function testMultipleAlerts(token) {
  console.log('\n📝 Test 13: Multiple Alerts for Same Crop');
  
  const alert1 = await makeAuthRequest('POST', '/api/price-alerts', {
    cropType: 'Cotton',
    targetPrice: 5000,
    alertType: 'below'
  }, token);
  
  const alert2 = await makeAuthRequest('POST', '/api/price-alerts', {
    cropType: 'Cotton',
    targetPrice: 6000,
    alertType: 'above'
  }, token);
  
  logTest('Create multiple alerts for same crop', alert1.success && alert2.success, 
    'Both alerts created successfully');
  
  // Clean up
  if (alert1.success) await makeAuthRequest('DELETE', `/api/price-alerts/${alert1.data.id}`, null, token);
  if (alert2.success) await makeAuthRequest('DELETE', `/api/price-alerts/${alert2.data.id}`, null, token);
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Price Alerts Feature Tests\n');
  console.log('=' .repeat(60));
  
  try {
    // Test authentication
    const token = await testAuthentication();
    
    if (!token) {
      console.log('\n❌ Authentication failed. Cannot proceed with tests.');
      return;
    }
    
    // Run API tests
    const alertId = await testCreateAlert(token);
    await testGetAlerts(token);
    await testGetSingleAlert(token, alertId);
    await testUpdateAlert(token, alertId);
    await testGetActiveAlerts(token);
    await testCheckAlerts(token);
    await testGetNotifications(token);
    await testValidation(token);
    await testAlertTypes(token);
    await testMultipleAlerts(token);
    
    // Clean up - delete test alert
    if (alertId) {
      await testDeleteAlert(token, alertId);
    }
    
    // Test frontend
    await testFrontendComponent();
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
  
  // Save results to file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-results-price-alerts-${timestamp}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));
  console.log(`\n📄 Detailed results saved to: ${filename}`);
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests();
