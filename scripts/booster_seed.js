/**
 * FILE: scripts/booster_seed.js
 * 
 * PURPOSE: Comprehensive mock data generator
 * Creates 50+ listings, negotiations, and messages to ensure no section is empty.
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Potato', 'Onion', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Mustard'];
const LOCATIONS = ['Pune, Maharashtra', 'Ludhiana, Punjab', 'Nashik, Maharashtra', 'Indore, Madhya Pradesh', 'Karnal, Haryana'];
const VENDORS = ['Rajesh Kumar', 'Suresh Patel', 'Amit Singh', 'Vijay Sharma', 'Sunil Pawar'];
const BUYERS = ['Karan Gupta', 'Rahul Verma', 'Deepak Reddy', 'Manoj Jain', 'Sanjay Gupta'];

async function boost() {
  console.log('🚀 Starting Data Booster...');

  try {
    // 1. Create Listings (50+)
    console.log('📦 Creating 50+ Listings...');
    for (let i = 0; i < 55; i++) {
      const crop = CROPS[i % CROPS.length];
      const vendor = VENDORS[i % VENDORS.length];
      const price = 20 + Math.random() * 80;
      
      await axios.post(`${API_BASE_URL}/listings`, {
        cropType: crop,
        variety: 'Desi',
        quantity: 100 + Math.floor(Math.random() * 900),
        unit: 'kg',
        pricePerUnit: price,
        location: LOCATIONS[i % LOCATIONS.length],
        vendorName: vendor,
        description: `High quality ${crop} from the fields of ${LOCATIONS[i % LOCATIONS.length]}. Guaranteed fresh.`,
        qualityInfo: {
          tier: i % 3 === 0 ? 'Premium' : (i % 3 === 1 ? 'Standard' : 'Basic'),
          moisture: 10 + Math.random() * 5,
          size: 'Uniform'
        }
      });
    }

    // Get all listing IDs
    const listingsRes = await axios.get(`${API_BASE_URL}/listings/search`);
    const listings = listingsRes.data.listings;
    console.log(`✅ Created ${listings.length} listings.`);

    // 2. Create Negotiations (50+)
    console.log('🤝 Creating 50+ Negotiations...');
    for (let i = 0; i < 60; i++) {
        const listing = listings[i % listings.length];
        const buyer = BUYERS[i % BUYERS.length];
        const offerPrice = Math.round(listing.finalPrice * 0.9 + Math.random() * 5);

        // First create the negotiation
        try {
            const negRes = await axios.post(`${API_BASE_URL}/negotiation/start`, {
              listingId: listing.id,
              buyerId: `buyer_${i % BUYERS.length}`,
              buyerName: buyer,
              initialOffer: offerPrice
            });

            const negId = negRes.data.negotiation.id;

            // Add some messages to the negotiation
            await axios.post(`${API_BASE_URL}/negotiation/${negId}/offer`, {
              offeredBy: 'buyer',
              price: offerPrice,
              reasoning: 'I am taking a bulk order.'
            });

            if (i % 3 === 0) {
              await axios.post(`${API_BASE_URL}/negotiation/${negId}/offer`, {
                offeredBy: 'vendor',
                price: offerPrice + 2,
                reasoning: 'My quality is premium.'
              });
            }
        } catch (e) {
            // Skip duplicates/errors
        }
    }
    console.log('✅ Created negotiations.');

    // 3. Create General Messages (50+)
    console.log('💬 Creating 50+ Messages...');
    for (let i = 0; i < 50; i++) {
        const sender = BUYERS[i % BUYERS.length];
        const receiver = VENDORS[i % VENDORS.length];
        
        await axios.post(`${API_BASE_URL}/messages`, {
            senderId: `buyer_${i % BUYERS.length}`,
            senderName: sender,
            receiverId: `vendor_${i % VENDORS.length}`,
            receiverName: receiver,
            content: `Hello ${receiver}, I am interested in your ${CROPS[i % CROPS.length]} listing. What is the final price?`,
            translatedContent: {
                hi: `नमस्ते ${receiver}, मुझे आपकी ${CROPS[i % CROPS.length]} लिस्टिंग में दिलचस्पी है। अंतिम कीमत क्या है?`
            }
        });
    }
    console.log('✅ Created messages.');

    console.log('✨ Booster Pack Applied Successfully!');
  } catch (error) {
    console.error('❌ Booster failed:', error.message);
  }
}

boost();
