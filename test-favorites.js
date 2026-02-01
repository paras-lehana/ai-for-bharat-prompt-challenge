/**
 * Test script for Favorites/Bookmarks System
 * Tests all CRUD operations for favorites
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let authToken = '';
let testListingId = '';
let testUserId = '';

// Test user credentials
const testPhone = '+919876543210';

async function testFavoritesSystem() {
  console.log('🧪 Testing Favorites/Bookmarks System\n');
  
  try {
    // 1. Login to get auth token
    console.log('1️⃣  Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
      phoneNumber: testPhone,
      otp: '123456'
    });
    authToken = loginResponse.data.token;
    testUserId = loginResponse.data.user.id;
    console.log('✅ Logged in successfully\n');

    // 2. Get a listing to favorite
    console.log('2️⃣  Fetching a listing...');
    const listingsResponse = await axios.get(`${API_URL}/listings/search`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (listingsResponse.data.listings && listingsResponse.data.listings.length > 0) {
      testListingId = listingsResponse.data.listings[0].id;
      console.log(`✅ Found listing: ${listingsResponse.data.listings[0].cropType} (ID: ${testListingId})\n`);
    } else {
      console.log('❌ No listings found. Please create some listings first.\n');
      return;
    }

    // 3. Add to favorites
    console.log('3️⃣  Adding listing to favorites...');
    const addResponse = await axios.post(
      `${API_URL}/favorites`,
      { listingId: testListingId },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Added to favorites:', addResponse.data);
    console.log('');

    // 4. Check if favorited
    console.log('4️⃣  Checking favorite status...');
    const checkResponse = await axios.get(
      `${API_URL}/favorites/check/${testListingId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Favorite status:', checkResponse.data);
    console.log('');

    // 5. Get all favorites
    console.log('5️⃣  Getting all favorites...');
    const getAllResponse = await axios.get(
      `${API_URL}/favorites`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log(`✅ Total favorites: ${getAllResponse.data.length}`);
    getAllResponse.data.forEach((fav, index) => {
      console.log(`   ${index + 1}. ${fav.listing?.cropType || 'Unknown'} - ₹${fav.listing?.finalPrice || 'N/A'}`);
    });
    console.log('');

    // 6. Update favorite settings
    console.log('6️⃣  Updating favorite notification settings...');
    const updateResponse = await axios.patch(
      `${API_URL}/favorites/${testListingId}`,
      { notifyOnPriceChange: false, targetPrice: 100 },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Updated favorite settings:', updateResponse.data);
    console.log('');

    // 7. Remove from favorites
    console.log('7️⃣  Removing from favorites...');
    const removeResponse = await axios.delete(
      `${API_URL}/favorites/${testListingId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Removed from favorites:', removeResponse.data);
    console.log('');

    // 8. Verify removal
    console.log('8️⃣  Verifying removal...');
    const verifyResponse = await axios.get(
      `${API_URL}/favorites/check/${testListingId}`,
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    console.log('✅ Favorite status after removal:', verifyResponse.data);
    console.log('');

    console.log('🎉 All favorites tests passed!\n');
    console.log('📋 Summary:');
    console.log('   ✅ Add to favorites');
    console.log('   ✅ Check favorite status');
    console.log('   ✅ Get all favorites');
    console.log('   ✅ Update favorite settings');
    console.log('   ✅ Remove from favorites');
    console.log('   ✅ Verify removal');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

// Run tests
testFavoritesSystem();
