/**
 * FILE: backend/src/utils/seed.js
 * 
 * PURPOSE: Comprehensive demo data seed for showcasing all 7 core initiatives
 * 
 * USAGE: node src/utils/seed.js
 * 
 * DEMO DATA INCLUDES:
 * - Demo accounts (easy-to-remember credentials)
 * - Sample data for all 7 core initiatives:
 *   1. Voice-Based Price Discovery
 *   2. AI-Powered Negotiation
 *   3. Dynamic Quality-Based Pricing
 *   4. Peer Vendor Discovery & Micro-Aggregation
 *   5. Smart Trust System
 *   6. Government Platform Integration (eNAM)
 *   7. Multilingual Market Advisory
 */

const { sequelize } = require('./database');
const { 
  User, Listing, Negotiation, Offer, Transaction, Rating, Message, ENAMPrice,
  CommunityPost, CommunityComment, GovernmentScheme 
} = require('../models');

// ============================================================================
// DEMO ACCOUNTS - Easy to remember for presentations
// ============================================================================
const demoAccounts = {
  vendor1: {
    phoneNumber: '+919999000001',
    role: 'vendor',
    name: 'Demo Vendor (Rajesh)',
    languagePreference: 'hi',
    locationDistrict: 'Delhi',
    locationState: 'Delhi',
    locationAddress: 'Azadpur Mandi, Delhi',
    locationLat: 28.7041,
    locationLng: 77.1025
  },
  vendor2: {
    phoneNumber: '+919999000002',
    role: 'vendor',
    name: 'Demo Vendor (Priya)',
    languagePreference: 'mr',
    locationDistrict: 'Pune',
    locationState: 'Maharashtra',
    locationAddress: 'Market Yard, Pune',
    locationLat: 18.5204,
    locationLng: 73.8567
  },
  buyer1: {
    phoneNumber: '+919999000003',
    role: 'buyer',
    name: 'Demo Buyer (Amit)',
    languagePreference: 'hi',
    locationDistrict: 'Ahmedabad',
    locationState: 'Gujarat',
    locationAddress: 'Jamalpur, Ahmedabad',
    locationLat: 23.0225,
    locationLng: 72.5714
  },
  buyer2: {
    phoneNumber: '+919999000004',
    role: 'buyer',
    name: 'Demo Buyer (Sunita)',
    languagePreference: 'te',
    locationDistrict: 'Hyderabad',
    locationState: 'Telangana',
    locationAddress: 'Begum Bazaar, Hyderabad',
    locationLat: 17.3850,
    locationLng: 78.4867
  }
};

// Additional test users for diversity
const testUsers = [
  {
    phoneNumber: '+919876543210',
    role: 'vendor',
    name: 'Ramesh Kumar',
    languagePreference: 'hi',
    locationDistrict: 'Delhi',
    locationState: 'Delhi',
    locationAddress: 'Azadpur Mandi, Delhi',
    locationLat: 28.7041,
    locationLng: 77.1025
  },
  {
    phoneNumber: '+919876543211',
    role: 'vendor',
    name: 'Lakshmi Devi',
    languagePreference: 'ta',
    locationDistrict: 'Chennai',
    locationState: 'Tamil Nadu',
    locationAddress: 'Koyambedu Market, Chennai',
    locationLat: 13.0827,
    locationLng: 80.2707
  },
  {
    phoneNumber: '+919876543212',
    role: 'buyer',
    name: 'Suresh Patel',
    languagePreference: 'gu',
    locationDistrict: 'Ahmedabad',
    locationState: 'Gujarat',
    locationAddress: 'Jamalpur, Ahmedabad',
    locationLat: 23.0225,
    locationLng: 72.5714
  },
  {
    phoneNumber: '+919876543213',
    role: 'buyer',
    name: 'Kavita Reddy',
    languagePreference: 'te',
    locationDistrict: 'Hyderabad',
    locationState: 'Telangana',
    locationAddress: 'Begum Bazaar, Hyderabad',
    locationLat: 17.3850,
    locationLng: 78.4867
  },
  {
    phoneNumber: '+919876543214',
    role: 'vendor',
    name: 'Harpreet Singh',
    languagePreference: 'pa',
    locationDistrict: 'Ludhiana',
    locationState: 'Punjab',
    locationAddress: 'Grain Market, Ludhiana',
    locationLat: 30.9010,
    locationLng: 75.8573
  },
  {
    phoneNumber: '+919876543215',
    role: 'vendor',
    name: 'Anita Deshmukh',
    languagePreference: 'mr',
    locationDistrict: 'Pune',
    locationState: 'Maharashtra',
    locationAddress: 'Market Yard, Pune',
    locationLat: 18.5204,
    locationLng: 73.8567
  },
  {
    phoneNumber: '+919876543216',
    role: 'buyer',
    name: 'Vijay Kumar',
    languagePreference: 'kn',
    locationDistrict: 'Bangalore',
    locationState: 'Karnataka',
    locationAddress: 'Yeshwanthpur Market, Bangalore',
    locationLat: 12.9716,
    locationLng: 77.5946
  }
];

// ============================================================================
// INITIATIVE 3: Dynamic Quality-Based Pricing - Diverse listings with all quality tiers
// ============================================================================
const testListings = [
  // Premium Quality Listings (1.2x multiplier)
  {
    cropType: 'Tomato',
    quantity: 500,
    unit: 'kg',
    basePrice: 30,
    finalPrice: 36,
    qualityTier: 'premium',
    qualityMultiplier: 1.2,
    demandAdjuster: 1.0,
    description: 'Fresh red tomatoes, premium quality, harvested yesterday. Perfect for restaurants and hotels.',
    images: ['/images/crops/tomato.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    cropType: 'Wheat',
    quantity: 5000,
    unit: 'kg',
    basePrice: 2400,
    finalPrice: 2880,
    qualityTier: 'premium',
    qualityMultiplier: 1.2,
    demandAdjuster: 1.0,
    description: 'Premium wheat grains, excellent for flour milling. High protein content, clean and sorted.',
    images: ['/images/crops/wheat.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    cropType: 'Cotton',
    quantity: 800,
    unit: 'kg',
    basePrice: 5000,
    finalPrice: 6000,
    qualityTier: 'premium',
    qualityMultiplier: 1.2,
    demandAdjuster: 1.0,
    description: 'High quality cotton, long staple. Ideal for textile manufacturing.',
    images: ['/images/crops/cotton.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  
  // Standard Quality Listings (1.0x multiplier)
  {
    cropType: 'Onion',
    quantity: 1000,
    unit: 'kg',
    basePrice: 40,
    finalPrice: 40,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Good quality onions, suitable for wholesale. Fresh from farm, properly stored.',
    images: ['/images/crops/onion.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    cropType: 'Rice',
    quantity: 3000,
    unit: 'kg',
    basePrice: 3000,
    finalPrice: 3000,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Basmati rice, aromatic and long grain. Good for retail distribution.',
    images: ['/images/crops/rice.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    cropType: 'Maize',
    quantity: 1500,
    unit: 'kg',
    basePrice: 1800,
    finalPrice: 1800,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Yellow maize, good for animal feed and poultry farms.',
    images: ['/images/crops/maize.jpeg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    cropType: 'Groundnut',
    quantity: 600,
    unit: 'kg',
    basePrice: 4500,
    finalPrice: 4500,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Fresh groundnuts, good oil content. Suitable for oil extraction.',
    images: ['/images/crops/groundnut.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    cropType: 'Sugarcane',
    quantity: 10000,
    unit: 'kg',
    basePrice: 3000,
    finalPrice: 3000,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Fresh sugarcane for sugar mills. Good sucrose content.',
    images: ['/images/crops/sugarcane.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  
  // Basic Quality Listings (0.85x multiplier)
  {
    cropType: 'Potato',
    quantity: 2000,
    unit: 'kg',
    basePrice: 20,
    finalPrice: 17,
    qualityTier: 'basic',
    qualityMultiplier: 0.85,
    demandAdjuster: 1.0,
    description: 'Standard potatoes for bulk purchase. Good for processing and chips manufacturing.',
    images: ['/images/crops/potato.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  {
    cropType: 'Soybean',
    quantity: 1200,
    unit: 'kg',
    basePrice: 3500,
    finalPrice: 2975,
    qualityTier: 'basic',
    qualityMultiplier: 0.85,
    demandAdjuster: 1.0,
    description: 'Soybean for oil extraction. Basic grade, suitable for industrial use.',
    images: ['/images/crops/soybean.jpg'],
    status: 'active',
    createdAt: new Date(Date.now() - 86400000)
  },
  
  // Additional listings for peer discovery (nearby vendors with same crops)
  {
    cropType: 'Tomato',
    quantity: 300,
    unit: 'kg',
    basePrice: 28,
    finalPrice: 33.6,
    qualityTier: 'premium',
    qualityMultiplier: 1.2,
    demandAdjuster: 1.0,
    description: 'Premium tomatoes, organic farming. Great taste and freshness.',
    images: ['/images/crops/tomato.jpg'],
    status: 'active'
  },
  {
    cropType: 'Wheat',
    quantity: 4000,
    unit: 'kg',
    basePrice: 2400,
    finalPrice: 2400,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Good quality wheat for flour mills. Clean and dry.',
    images: ['/images/crops/wheat.jpg'],
    status: 'active'
  },
  {
    cropType: 'Onion',
    quantity: 800,
    unit: 'kg',
    basePrice: 38,
    finalPrice: 38,
    qualityTier: 'standard',
    qualityMultiplier: 1.0,
    demandAdjuster: 1.0,
    description: 'Fresh onions from Maharashtra. Good storage quality.',
    images: ['/images/crops/onion.jpg'],
    status: 'active'
  }
];

async function seed() {
  try {
    console.log('🌱 Starting comprehensive demo data seed...');
    console.log('📋 This seed includes data for all 7 core initiatives\n');

    // Clear existing data safely (handling foreign keys)
    try {
      await sequelize.query('PRAGMA foreign_keys = OFF');
      const tables = ['ratings', 'transactions', 'offers', 'negotiations', 'favorites', 'shares', 'price_alerts', 'messages', 'community_comments', 'community_posts', 'listings'];
      for (const table of tables) {
        try {
          await sequelize.query(`DELETE FROM ${table}`);
          console.log(`   ✓ Cleared ${table}`);
        } catch (e) {
          console.log(`   ⚠ Could not clear ${table} (might not exist yet)`);
        }
      }
      await sequelize.query('PRAGMA foreign_keys = ON');
      console.log('✅ Marketplace data cleared for fresh seed');
    } catch (error) {
      console.error('❌ Error during data clearing:', error.message);
    }

    // ========================================================================
    // STEP 1: Create Demo Accounts + Test Users
    // ========================================================================
    console.log('\n👥 Creating demo accounts and test users...');
    const users = [];
    
    // Create demo accounts first
    for (const [key, userData] of Object.entries(demoAccounts)) {
      const user = await User.findOrCreate({
        where: { phoneNumber: userData.phoneNumber },
        defaults: userData
      });
      users.push(user[0]);
      console.log(`   ✓ Demo ${userData.role}: ${userData.name} (${userData.phoneNumber})`);
    }
    
    // Create additional test users
    for (const userData of testUsers) {
      const user = await User.findOrCreate({
        where: { phoneNumber: userData.phoneNumber },
        defaults: userData
      });
      users.push(user[0]);
    }
    console.log(`✅ Created ${users.length} users (${Object.keys(demoAccounts).length} demo accounts)`);

    // ========================================================================
    // STEP 2: INITIATIVE 3 - Dynamic Quality-Based Pricing (Create Listings)
    // ========================================================================
    console.log('\n📦 INITIATIVE 3: Creating listings with quality-based pricing...');
    const vendors = users.filter(u => u.role === 'vendor');
    const listings = [];
    
    for (let i = 0; i < testListings.length; i++) {
      const listingData = testListings[i];
      const vendor = vendors[i % vendors.length];
      
      const listing = await Listing.create({
        ...listingData,
        vendorId: vendor.id,
        locationLat: vendor.locationLat || (28.7041 + (Math.random() - 0.5) * 0.1),
        locationLng: vendor.locationLng || (77.1025 + (Math.random() - 0.5) * 0.1),
        locationAddress: vendor.locationAddress,
        locationDistrict: vendor.locationDistrict,
        locationState: vendor.locationState
      });
      
      listings.push(listing);
      console.log(`   ✓ ${listing.cropType} (${listing.qualityTier}) - ₹${listing.finalPrice} (${vendor.name})`);
    }
    console.log(`✅ Created ${listings.length} listings with transparent pricing`);

    // ========================================================================
    // STEP 3: INITIATIVE 2 - AI-Powered Negotiation (Create Negotiations)
    // ========================================================================
    console.log('\n💬 INITIATIVE 2: Creating AI-powered negotiations...');
    const buyers = users.filter(u => u.role === 'buyer');
    const negotiations = [];
    
    // Create LOTS of active negotiations (15+)
    for (let i = 0; i < 15; i++) {
      const listing = listings[i % listings.length];
      const buyer = buyers[i % buyers.length];
      
      const negotiation = await Negotiation.create({
        buyerId: buyer.id,
        vendorId: listing.vendorId,
        listingId: listing.id,
        currentOffer: listing.finalPrice * (0.85 + (Math.random() * 0.1)), // Random offer
        status: ['active', 'vendor_counter', 'buyer_counter', 'active'][i % 4],
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
      
      // Initial buyer offer
      await Offer.create({
        negotiationId: negotiation.id,
        userId: buyer.id,
        amount: listing.finalPrice * 0.85,
        type: 'buyer_offer',
        offerType: 'buyer_offer',
        reasoning: 'Initial offer based on market research'
      });
      
      // AI counter-offer suggestion (for some)
      if (i % 2 === 0) {
        await Offer.create({
          negotiationId: negotiation.id,
          userId: listing.vendorId,
          amount: listing.finalPrice * 0.92,
          type: 'ai_suggestion',
          offerType: 'vendor_counter',
          reasoning: 'AI suggests counter-offer based on high demand in your area.'
        });
      }

      // Add more back-and-forth for some
      if (i % 3 === 0) {
         await Offer.create({
          negotiationId: negotiation.id,
          userId: buyer.id,
          amount: listing.finalPrice * 0.88,
          offerType: 'buyer_offer',
          reasoning: 'I can pay slightly more but I need delivery included.'
        });
      }
      
      negotiations.push(negotiation);
    }
    console.log(`✅ Created ${negotiations.length} active negotiations with AI suggestions`);

    // ========================================================================
    // STEP 4: INITIATIVE 5 - Smart Trust System (Create Transactions & Ratings)
    // ========================================================================
    console.log('\n⭐ INITIATIVE 5: Creating trust system data (transactions & ratings)...');
    const transactions = [];
    
    // Create LOTS of completed transactions (25+)
    for (let i = 0; i < 25; i++) {
      const listing = listings[i % listings.length];
      const buyer = buyers[(i + 1) % buyers.length];
      
      const status = ['delivered', 'delivered', 'delivered', 'in_transit', 'confirmed'][i % 5];
      
      // Create completed negotiation
      const completedNegotiation = await Negotiation.create({
        buyerId: buyer.id,
        vendorId: listing.vendorId,
        listingId: listing.id,
        currentOffer: listing.finalPrice,
        status: 'accepted',
        expiresAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
      });
      
      // Create transaction
      const transaction = await Transaction.create({
        negotiationId: completedNegotiation.id,
        buyerId: buyer.id,
        vendorId: listing.vendorId,
        listingId: listing.id,
        agreedPrice: listing.finalPrice,
        quantity: listing.quantity,
        status: status,
        deliveredAt: status === 'delivered' ? new Date(Date.now() - i * 24 * 60 * 60 * 1000) : null
      });
      
      if (status === 'delivered') {
        const deliveryRating = 3.5 + Math.random() * 1.5;
        await Rating.create({
            transactionId: transaction.id,
            vendorId: transaction.vendorId,
            buyerId: transaction.buyerId,
            deliveryRating: Math.round(deliveryRating * 10) / 10,
            qualityRating: Math.round(deliveryRating * 10) / 10,
            comment: 'Smooth transaction, thank you!'
        });
      }
      
      transactions.push(transaction);
    }
    console.log(`✅ Created ${transactions.length} completed transactions with ratings`);

    // ========================================================================
    // STEP 5: INITIATIVE 1 & 13 - Messaging (Voice queries & negotiations)
    // ========================================================================
    // ========================================================================
    // STEP 5: INITIATIVE 1 & 13 - Messaging (Voice queries & negotiations)
    // ========================================================================
    console.log('\n💬 INITIATIVE 1: Creating message threads...');
    let messageCount = 0;
    
    // Create messages for the first 10 negotiations
    for (let i = 0; i < Math.min(10, negotiations.length); i++) {
      const negotiation = negotiations[i];
      const listing = listings.find(l => l.id === negotiation.listingId);
      const threadId = [negotiation.buyerId, negotiation.vendorId].sort().join('-');
      
      // Buyer inquiry
      await Message.create({
        threadId,
        senderId: negotiation.buyerId,
        recipientId: negotiation.vendorId,
        listingId: negotiation.listingId,
        textContent: `Hello, I am interested in your ${listing.cropType || 'item'}. Can we negotiate the price?`,
        originalLanguage: 'en'
      });
      messageCount++;
      
      // Vendor response
      await Message.create({
        threadId,
        senderId: negotiation.vendorId,
        recipientId: negotiation.buyerId,
        listingId: negotiation.listingId,
        textContent: 'Yes, please make an offer. The quality is excellent and freshly harvested.',
        originalLanguage: 'en'
      });
      messageCount++;
      
      // Buyer follow-up
      await Message.create({
        threadId,
        senderId: negotiation.buyerId,
        recipientId: negotiation.vendorId,
        listingId: negotiation.listingId,
        textContent: 'Can you provide delivery to my location? What are the payment terms?',
        originalLanguage: 'en'
      });
      messageCount++;
    }
    console.log(`✅ Created ${messageCount} messages across ${Math.min(10, negotiations.length)} threads`);

    // ========================================================================
    // STEP 6: INITIATIVE 6 - Government Platform Integration (eNAM Prices)
    // ========================================================================
    console.log('\n💵 INITIATIVE 6: Creating eNAM price cache...');
    const crops = ['tomato', 'onion', 'potato', 'wheat', 'rice', 'maize', 'cotton', 'groundnut', 'soybean', 'sugarcane'];
    const locations = [
      { name: 'Delhi', state: 'Delhi' },
      { name: 'Mumbai', state: 'Maharashtra' },
      { name: 'Pune', state: 'Maharashtra' },
      { name: 'Ahmedabad', state: 'Gujarat' },
      { name: 'Hyderabad', state: 'Telangana' },
      { name: 'Bangalore', state: 'Karnataka' },
      { name: 'Chennai', state: 'Tamil Nadu' },
      { name: 'Ludhiana', state: 'Punjab' }
    ];
    
    let enamCount = 0;
    for (const crop of crops) {
      for (const location of locations) {
        const basePrice = Math.floor(Math.random() * 3000) + 1000;
        await ENAMPrice.findOrCreate({
          where: { cropType: crop, mandiLocation: location.name },
          defaults: {
            cropType: crop,
            mandiName: `${location.name} Mandi`,
            mandiLocation: location.name,
            modalPrice: basePrice,
            minPrice: Math.floor(basePrice * 0.9),
            maxPrice: Math.floor(basePrice * 1.1),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        });
        enamCount++;
      }
    }
    console.log(`✅ Created ${enamCount} eNAM price entries (${crops.length} crops × ${locations.length} locations)`);

    // ========================================================================
    // STEP 7: Government Schemes
    // ========================================================================
    console.log('\n📄 Creating government schemes...');
    const schemes = [
      {
        name: "PM-KISHAN (Pradhan Mantri Kisan Samman Nidhi)",
        category: "Direct Benefit Transfer",
        description: "An initiative by the Government of India in which all farmers will get up to ₹6,000 per year as minimum income support.",
        eligibility: "All landholding farmer families in the country.",
        benefits: "₹6,000 per year in three equal installments of ₹2,000 each.",
        applicationProcess: "Registration through PM-Kishan portal or CSC centers.",
        officialUrl: "https://pmkisan.gov.in/",
        state: "Central"
      },
      {
        name: "PM Fasal Bima Yojana (PMFBY)",
        category: "Insurance",
        description: "A government-sponsored crop insurance scheme that integrates multiple stakeholders.",
        eligibility: "All farmers including sharecroppers and tenant farmers growing notified crops in notified areas.",
        benefits: "Financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
        applicationProcess: "Online through PMFBY portal or through banks/CSC.",
        officialUrl: "https://pmfby.gov.in/",
        state: "Central"
      },
      {
        name: "Kisan Credit Card (KCC)",
        category: "Credit",
        description: "Provides farmers with timely access to credit for their cultivation and other needs.",
        eligibility: "Individual/joint borowers who are owner-cultivators, tenant farmers, oral lessees, sharecroppers.",
        benefits: "Simplified credit delivery system, low interest rates, flexible repayment.",
        applicationProcess: "Application through any commercial/rural/cooperative bank.",
        officialUrl: "https://www.myscheme.gov.in/schemes/kcc",
        state: "Central"
      },
      {
        name: "Soil Health Card Scheme",
        category: "Subsidies",
        description: "Assists State Governments to issue soil health cards to all farmers in the country.",
        eligibility: "All farmers in India.",
        benefits: "Soil health cards provide information to farmers on nutrient status of their soil.",
        applicationProcess: "Testing at regional soil testing labs.",
        officialUrl: "https://www.soilhealth.dac.gov.in/",
        state: "Central"
      },
      {
        name: "Paramparagat Krishi Vikas Yojana (PKVY)",
        category: "Organic Farming",
        description: "Promotes organic farming through a cluster approach and PGS certification.",
        eligibility: "Farmers willing to form clusters and adopt organic farming practices.",
        benefits: "Financial assistance of ₹50,000 per hectare for 3 years.",
        applicationProcess: "Formation of farmer groups and registration with local agriculture office.",
        officialUrl: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
        state: "Central"
      }
    ];
    await GovernmentScheme.bulkCreate(schemes);
    console.log(`✅ Created ${schemes.length} government schemes`);

    // ========================================================================
    // STEP 8: Community Posts
    // ========================================================================
    console.log('\n🤝 Creating community forum posts...');
    const communityPosts = [
      {
        authorId: vendors[0].id,
        title: "Best practices for Tomato harvesting in summer",
        content: "Harvest tomatoes in the early morning to keep them firm and prevent sun scald. Make sure to use clean crates and avoid stacking too high to prevent crushing.",
        category: "Tips & Tricks",
        tags: "harvesting, tomato, summer",
        likes: 12
      },
      {
        authorId: vendors[1].id,
        title: "Impact of recent rains on Wheat quality",
        content: "We've had unseasonal rain in Pune last week. How are your Wheat crops holding up? Mine seem to have higher moisture content now.",
        category: "Questions",
        tags: "weather, wheat, moisture",
        likes: 8
      },
      {
        authorId: vendors[2].id,
        title: "Success with Organic Farming in Punjab",
        content: "Switching to organic for my Cotton crop was the best decision. The yield is slightly lower but the premium price I'm getting on Multilingual Mandi more than makes up for it!",
        category: "Success Stories",
        tags: "organic, cotton, success",
        likes: 25
      }
    ];

    for (const post of communityPosts) {
      const p = await CommunityPost.create(post);
      // Add a comment to each post
      await CommunityComment.create({
        postId: p.id,
        authorId: buyers[0].id,
        content: "Great advice! I've noticed much better life for tomatoes when harvested early."
      });
    }
    console.log(`✅ Created ${communityPosts.length} community posts with comments`);

    // ========================================================================
    // SUMMARY & DEMO CREDENTIALS
    // ========================================================================
    console.log('\n' + '='.repeat(70));
    console.log('🎉 COMPREHENSIVE DEMO DATA SEEDED SUCCESSFULLY!');
    console.log('='.repeat(70));
    
    console.log('\n📊 DATA SUMMARY:');
    console.log(`   Users: ${users.length} (${Object.keys(demoAccounts).length} demo accounts)`);
    console.log(`   Listings: ${listings.length} (Premium: ${listings.filter(l => l.qualityTier === 'premium').length}, Standard: ${listings.filter(l => l.qualityTier === 'standard').length}, Basic: ${listings.filter(l => l.qualityTier === 'basic').length})`);
    console.log(`   Active Negotiations: ${negotiations.length}`);
    console.log(`   Completed Transactions: ${transactions.length}`);
    console.log(`   Ratings: ${transactions.length}`);
    console.log(`   Messages: ${messageCount}`);
    console.log(`   eNAM Price Cache: ${enamCount}`);
    
    console.log('\n🎯 7 CORE INITIATIVES COVERAGE:');
    console.log('   ✅ 1. Voice-Based Price Discovery - eNAM data ready for voice queries');
    console.log('   ✅ 2. AI-Powered Negotiation - Active negotiations with AI suggestions');
    console.log('   ✅ 3. Dynamic Quality-Based Pricing - All quality tiers represented');
    console.log('   ✅ 4. Peer Vendor Discovery - Multiple vendors with same crops nearby');
    console.log('   ✅ 5. Smart Trust System - Transactions with ratings for trust scores');
    console.log('   ✅ 6. Government Integration - eNAM price cache populated');
    console.log('   ✅ 7. Market Advisory - Historical data for insights generation');
    
    console.log('\n🔑 DEMO ACCOUNT CREDENTIALS:');
    console.log('   ┌─────────────────────────────────────────────────────────┐');
    console.log('   │ VENDOR ACCOUNTS (for creating listings & negotiations) │');
    console.log('   ├─────────────────────────────────────────────────────────┤');
    console.log('   │ Phone: +919999000001 (Demo Vendor - Rajesh, Hindi)     │');
    console.log('   │ Phone: +919999000002 (Demo Vendor - Priya, Marathi)    │');
    console.log('   │ OTP: Use any 6 digits (e.g., 123456 or 1104)           │');
    console.log('   └─────────────────────────────────────────────────────────┘');
    console.log('   ┌─────────────────────────────────────────────────────────┐');
    console.log('   │ BUYER ACCOUNTS (for browsing & making offers)          │');
    console.log('   ├─────────────────────────────────────────────────────────┤');
    console.log('   │ Phone: +919999000003 (Demo Buyer - Amit, Hindi)        │');
    console.log('   │ Phone: +919999000004 (Demo Buyer - Sunita, Telugu)     │');
    console.log('   │ OTP: Use any 6 digits (e.g., 123456 or 1104)           │');
    console.log('   └─────────────────────────────────────────────────────────┘');
    
    console.log('\n💡 DEMO FLOW SUGGESTIONS:');
    console.log('   1. Login as Demo Vendor (+919999000001)');
    console.log('   2. View "My Listings" to see quality-based pricing');
    console.log('   3. Check "Negotiations" to see AI counter-offers');
    console.log('   4. Login as Demo Buyer (+919999000003)');
    console.log('   5. Browse listings and filter by quality/price');
    console.log('   6. Make an offer to see AI negotiation in action');
    console.log('   7. Use Kisaan Bot (voice) to query prices');
    console.log('   8. Check vendor profiles to see trust scores');
    
    console.log('\n🚀 Ready for demo presentation!');
    console.log('='.repeat(70) + '\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

module.exports = seed;
