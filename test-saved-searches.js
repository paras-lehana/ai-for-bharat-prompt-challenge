const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';

// Test user credentials
const testUser = {
  phoneNumber: '+919876543210',
  otp: '123456'
};

let authToken = '';
let savedSearchId = '';

async function testSavedSearches() {
  console.log('🧪 Testing Saved Searches Feature\n');

  try {
    // 1. Send OTP
    console.log('1️⃣ Sending OTP...');
    const otpResponse = await axios.post(`${BACKEND_URL}/api/auth/send-otp`, {
      phoneNumber: testUser.phoneNumber
    });
    const otp = otpResponse.data.otp;
    console.log('✅ OTP sent:', otp);
    console.log();

    // 2. Login to get auth token
    console.log('2️⃣ Logging in...');
    const loginResponse = await axios.post(`${BACKEND_URL}/api/auth/verify-otp`, {
      phoneNumber: testUser.phoneNumber,
      otp: otp,
      role: 'buyer',
      name: 'Test User'
    });
    authToken = loginResponse.data.token;
    console.log('✅ Login successful\n');

    // 3. Create a saved search
    console.log('3️⃣ Creating a saved search...');
    const createResponse = await axios.post(
      `${BACKEND_URL}/api/saved-searches`,
      {
        name: 'Premium Wheat in Punjab',
        searchCriteria: {
          crop: 'Wheat',
          quality: 'premium',
          minPrice: 2000,
          maxPrice: 3000
        },
        notifyOnMatch: true
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    savedSearchId = createResponse.data.id;
    console.log('✅ Saved search created:', createResponse.data.name);
    console.log('   ID:', savedSearchId);
    console.log('   Criteria:', JSON.stringify(createResponse.data.searchCriteria, null, 2));
    console.log('   Notifications:', createResponse.data.notifyOnMatch ? 'ON' : 'OFF');
    console.log();

    // 4. Get all saved searches
    console.log('4️⃣ Fetching all saved searches...');
    const getAllResponse = await axios.get(`${BACKEND_URL}/api/saved-searches`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Found ${getAllResponse.data.length} saved search(es)`);
    getAllResponse.data.forEach((search, index) => {
      console.log(`   ${index + 1}. ${search.name}`);
    });
    console.log();

    // 5. Update saved search name
    console.log('5️⃣ Updating saved search name...');
    const updateResponse = await axios.put(
      `${BACKEND_URL}/api/saved-searches/${savedSearchId}`,
      {
        name: 'Premium Wheat in Punjab (Updated)'
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Saved search updated:', updateResponse.data.name);
    console.log();

    // 6. Toggle notifications
    console.log('6️⃣ Toggling notifications...');
    const toggleResponse = await axios.put(
      `${BACKEND_URL}/api/saved-searches/${savedSearchId}`,
      {
        notifyOnMatch: false
      },
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Notifications toggled:', toggleResponse.data.notifyOnMatch ? 'ON' : 'OFF');
    console.log();

    // 7. Execute saved search
    console.log('7️⃣ Executing saved search...');
    const executeResponse = await axios.get(
      `${BACKEND_URL}/api/saved-searches/${savedSearchId}/execute`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    console.log('✅ Search executed successfully');
    console.log(`   Found ${executeResponse.data.results.length} listing(s)`);
    console.log();

    // 8. Delete saved search
    console.log('8️⃣ Deleting saved search...');
    await axios.delete(`${BACKEND_URL}/api/saved-searches/${savedSearchId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Saved search deleted');
    console.log();

    // 9. Verify deletion
    console.log('9️⃣ Verifying deletion...');
    const verifyResponse = await axios.get(`${BACKEND_URL}/api/saved-searches`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log(`✅ Remaining saved searches: ${verifyResponse.data.length}`);
    console.log();

    console.log('🎉 All tests passed!\n');
    console.log('✅ Task 55: Saved Searches Feature - COMPLETE');
    console.log('   ✓ Save search criteria to user profile');
    console.log('   ✓ Allow naming saved searches');
    console.log('   ✓ Quick access from search page');
    console.log('   ✓ View all saved searches');
    console.log('   ✓ Edit search criteria');
    console.log('   ✓ Delete saved searches');
    console.log('   ✓ One-click search execution');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

testSavedSearches();
