/**
 * FILE: scripts/direct_db_booster.js
 * 
 * PURPOSE: Direct database booster to bypass auth
 * Populates 50+ entries for listings, negotiations, and messages.
 */

const { Listing, Negotiation, Message, User } = require('/root/repo/ai-for-bharat-prompt-challenge/backend/src/models');

async function boost() {
  console.log('🚀 Starting Robust Direct DB Booster...');

  const generateId = () => `id_${Date.now()}_${Math.floor(Math.random() * 10000)}_${Math.floor(Math.random() * 1000)}`;

  try {
    // 1. Get ALL users
    const allUsers = await User.findAll();
    if (allUsers.length < 2) {
      console.log('⚠️ Not enough users, creating test accounts...');
      const vendor = await User.create({
        id: 'vendor_test',
        phoneNumber: '9999999999',
        name: 'Rajesh Farmer',
        role: 'vendor',
        languagePreference: 'hi'
      });
      const buyer = await User.create({
        id: 'buyer_test',
        phoneNumber: '8888888888',
        name: 'Karan Buyer',
        role: 'buyer',
        languagePreference: 'hi'
      });
      allUsers.push(vendor, buyer);
    }

    const vendors = allUsers.filter(u => u.role === 'vendor' || !u.role);
    const buyers = allUsers.filter(u => u.role === 'buyer');

    if (vendors.length === 0 || buyers.length === 0) {
        console.log('⚠️ Still missing roles, defaulting first two users...');
        vendors.push(allUsers[0]);
        buyers.push(allUsers[1] || allUsers[0]);
    }

    const CROPS = ['Wheat', 'Rice', 'Tomato', 'Potato', 'Onion', 'Sugarcane', 'Cotton', 'Maize', 'Soybean', 'Mustard', 'Peanuts', 'Corn'];
    const LOCATIONS = ['Pune', 'Ludhiana', 'Nashik', 'Indore', 'Karnal', 'Delhi', 'Nagpur'];

    // 2. Create 60 Listings (distributed among vendors)
    console.log(`📦 Creating 60 listings for ${vendors.length} vendors...`);
    for (let i = 0; i < 60; i++) {
        const vendor = vendors[i % vendors.length];
        const crop = CROPS[i % CROPS.length];
        const basePrice = 20 + Math.random() * 80;
        await Listing.create({
            id: generateId(),
            vendorId: vendor.id,
            cropType: crop,
            variety: 'Premium Desi',
            quantity: 500 + Math.floor(Math.random() * 2000),
            unit: 'kg',
            basePrice: basePrice,
            finalPrice: basePrice * (1 + (Math.random() * 0.4)),
            qualityTier: i % 3 === 0 ? 'premium' : 'standard',
            qualityMultiplier: 1.1 + (Math.random() * 0.2),
            demandAdjuster: 0.9 + (Math.random() * 0.2),
            locationLat: 28.6139 + (Math.random() - 0.5),
            locationLng: 77.2090 + (Math.random() - 0.5),
            locationAddress: LOCATIONS[i % LOCATIONS.length],
            status: 'active',
            description: `Freshly harvested ${crop}. High yield variety, chemical free. Best for wholesale.`
        });
    }

    const listings = await Listing.findAll({ limit: 50 });

    // 3. Create 50 Negotiations (linked to various buyers/vendors)
    console.log(`🤝 Creating 50 negotiations for ${buyers.length} buyers...`);
    for (let i = 0; i < 50; i++) {
        const listing = listings[i % listings.length];
        const buyer = buyers[i % buyers.length];
        await Negotiation.create({
            id: generateId(),
            listingId: listing.id,
            buyerId: buyer.id,
            vendorId: listing.vendorId,
            initialOffer: listing.finalPrice * 0.85,
            lastOffer: listing.finalPrice * (0.9 + (Math.random() * 0.1)),
            status: i % 5 === 0 ? 'accepted' : 'active',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });
    }

    // 4. Create 50 Messages (varied content)
    console.log('💬 Creating 50 messages with mixed languages...');
    const sampleMsgs = [
        "Hello, is this still available?",
        "जी, क्या यह अभी उपलब्ध है?",
        "What is the final price?",
        "अंतिम मूल्य क्या है?",
        "I want to buy 1000kg.",
        "मुझे १००० किलो खरीदना है।",
        "Can you ship to Ludhiana?",
        "क्या आप लुधियाना भेज सकते हैं?",
        "Price is too high, lower it please.",
        "कीमत बहुत ज्यादा है, कृपया कम करें।"
    ];

    for (let i = 0; i < 50; i++) {
        const buyer = buyers[Math.floor(Math.random() * buyers.length)];
        const vendor = vendors[Math.floor(Math.random() * vendors.length)];
        await Message.create({
            id: generateId(),
            senderId: i % 2 === 0 ? buyer.id : vendor.id,
            recipientId: i % 2 === 0 ? vendor.id : buyer.id,
            threadId: `thread_${buyer.id}_${vendor.id}`,
            content: sampleMsgs[i % sampleMsgs.length],
            originalLanguage: i % 2 === 0 ? 'en' : 'hi',
            status: 'sent'
        });
    }

    console.log('✨ DB Boosted successfully with global data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Boost failed:', err);
    process.exit(1);
  }
}

boost();
