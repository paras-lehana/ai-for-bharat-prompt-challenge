/**
 * Test script for Listing Creation via API
 */
const axios = require('axios');

async function testListingCreation() {
    const API_URL = 'http://localhost:5000/api';
    const TEST_TOKEN = 'test-token-12345'; // From .env TEST_USER_TOKEN
    
    console.log('🧪 Testing listing creation...');
    
    try {
        const response = await axios.post(`${API_URL}/listings`, {
            cropType: 'Tomato',
            quantity: 50,
            unit: 'Kg',
            basePrice: 15,
            qualityTier: 'standard',
            description: 'Testing voice added tomato',
            location: {
                latitude: 28.6139,
                longitude: 77.2090,
                address: 'Delhi Mandi'
            }
        }, {
            headers: {
                'Authorization': `Bearer ${TEST_TOKEN}`
            }
        });
        
        console.log('✅ Listing created successfully!');
        console.log('Listing ID:', response.data.listing.id);
        console.log('Final Price:', response.data.listing.finalPrice);
        
        // Verify in search
        const searchRes = await axios.get(`${API_URL}/listings/search?cropType=Tomato`);
        const found = searchRes.data.listings.find(l => l.id === response.data.listing.id);
        if (found) {
            console.log('✅ Verified: Listing found in search results!');
        } else {
            console.log('❌ Error: Listing NOT found in search results!');
        }
        
    } catch (error) {
        console.error('❌ Listing creation failed:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

testListingCreation();
