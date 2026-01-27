/**
 * Database Seeding Script
 * Creates dummy vendors, buyers, and listings for testing
 */

const { User, Listing, TrustScore, Rating, Negotiation, Offer } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Crop image mapping with case-insensitive regex matching
const cropImageMap = {
  wheat: 'wheat.jpg',
  rice: 'rice.jpg',
  tomato: 'tomato.jpg',
  onion: 'onion.jpg',
  potato: 'potato.jpg',
  cotton: 'cotton.png',
  sugarcane: 'sugarcane.webp',
  maize: 'maize.jpeg',
  soybean: 'soybean.jpg',
  groundnut: 'groundnut.jpg'
};

/**
 * Get image path for a crop name (case-insensitive)
 * @param {string} cropName - Name of the crop
 * @returns {string} - Image path
 */
function getCropImage(cropName) {
  const normalizedName = cropName.toLowerCase().trim();
  const imageName = cropImageMap[normalizedName];
  
  if (!imageName) {
    console.warn(`⚠️  No image found for crop: ${cropName}, using default`);
    return 'wheat.jpg'; // Default fallback
  }
  
  return imageName;
}

const crops = [
  { name: 'Wheat', image: 'wheat.jpg' },
  { name: 'Rice', image: 'rice.jpg' },
  { name: 'Tomato', image: 'tomato.jpg' },
  { name: 'Onion', image: 'onion.jpg' },
  { name: 'Potato', image: 'potato.jpg' },
  { name: 'Cotton', image: 'cotton.png' },
  { name: 'Sugarcane', image: 'sugarcane.webp' },
  { name: 'Maize', image: 'maize.jpeg' },
  { name: 'Soybean', image: 'soybean.jpg' },
  { name: 'Groundnut', image: 'groundnut.jpg' }
];
const qualities = ['premium', 'standard', 'basic'];
const locations = [
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create vendors
    const vendors = [];
    for (let i = 1; i <= 10; i++) {
      const location = locations[i % locations.length];
      const vendor = await User.create({
        id: uuidv4(),
        phoneNumber: `+9198765432${10 + i}`,
        name: `Vendor ${i}`,
        role: 'vendor',
        languagePreference: ['hi', 'mr', 'ta', 'te', 'kn', 'pa'][i % 6],
        locationLat: location.lat,
        locationLng: location.lng,
        locationAddress: `${location.city}, ${location.state}`
      });
      vendors.push(vendor);

      // Create trust score for vendor
      await TrustScore.create({
        id: uuidv4(),
        vendorId: vendor.id,
        overallScore: (3.5 + Math.random() * 1.5).toFixed(2),
        deliveryScore: (3.5 + Math.random() * 1.5).toFixed(2),
        qualityScore: (3.5 + Math.random() * 1.5).toFixed(2),
        responseScore: (3.5 + Math.random() * 1.5).toFixed(2),
        fairPricingScore: (3.5 + Math.random() * 1.5).toFixed(2),
        transactionCount: Math.floor(Math.random() * 50) + 10,
        badges: i % 3 === 0 ? JSON.stringify(['Trusted Vendor']) : null
      });
    }

    console.log(`✅ Created ${vendors.length} vendors with trust scores`);

    // Create buyers
    const buyers = [];
    for (let i = 1; i <= 5; i++) {
      const location = locations[i % locations.length];
      const buyer = await User.create({
        id: uuidv4(),
        phoneNumber: `+9198765433${10 + i}`,
        name: `Buyer ${i}`,
        role: 'buyer',
        languagePreference: ['hi', 'mr', 'ta', 'te', 'kn'][i % 5],
        locationLat: location.lat,
        locationLng: location.lng,
        locationAddress: `${location.city}, ${location.state}`
      });
      buyers.push(buyer);
    }

    console.log(`✅ Created ${buyers.length} buyers`);

    // Create listings with older dates for mock data
    let listingCount = 0;
    const now = new Date();
    
    for (const vendor of vendors) {
      const numListings = Math.floor(Math.random() * 3) + 2; // 2-4 listings per vendor
      
      for (let i = 0; i < numListings; i++) {
        const crop = crops[Math.floor(Math.random() * crops.length)];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const basePrice = Math.floor(Math.random() * 2000) + 1000;
        const qualityMultiplier = quality === 'premium' ? 1.2 : quality === 'standard' ? 1.0 : 0.85;
        const demandAdjuster = 0.9 + Math.random() * 0.3; // 0.9 to 1.2
        const finalPrice = Math.round(basePrice * qualityMultiplier * demandAdjuster);
        
        // Get correct image for crop (case-insensitive)
        const cropImage = getCropImage(crop.name);

        // Create listing with older date (1-30 days ago)
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        const createdAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

        await Listing.create({
          id: uuidv4(),
          vendorId: vendor.id,
          cropType: crop.name,
          quantity: Math.floor(Math.random() * 500) + 50,
          unit: ['Quintal', 'Kg', 'Ton'][Math.floor(Math.random() * 3)],
          basePrice,
          qualityTier: quality,
          qualityMultiplier,
          demandAdjuster: demandAdjuster.toFixed(2),
          finalPrice,
          description: `Fresh ${crop.name} from ${vendor.locationAddress}. High quality ${quality} grade.`,
          images: JSON.stringify([`/images/crops/${cropImage}`]),
          locationLat: vendor.locationLat,
          locationLng: vendor.locationLng,
          locationAddress: vendor.locationAddress,
          status: 'active',
          createdAt, // Set older date
          updatedAt: createdAt
        });
        listingCount++;
      }
    }

    console.log(`✅ Created ${listingCount} listings`);

    // Create negotiations with offers
    const allListings = await Listing.findAll();
    let negotiationCount = 0;
    let offerCount = 0;

    for (let i = 0; i < Math.min(buyers.length * 2, allListings.length); i++) {
      const listing = allListings[i];
      const buyer = buyers[i % buyers.length];
      
      // Create negotiation
      const negotiation = await Negotiation.create({
        id: uuidv4(),
        listingId: listing.id,
        buyerId: buyer.id,
        vendorId: listing.vendorId,
        status: ['active', 'active', 'accepted', 'rejected'][i % 4], // Mix of statuses
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      });
      negotiationCount++;

      // Create initial buyer offer (10-20% below listing price)
      const buyerOfferAmount = Math.round(listing.finalPrice * (0.8 + Math.random() * 0.1));
      await Offer.create({
        id: uuidv4(),
        negotiationId: negotiation.id,
        userId: buyer.id,
        amount: buyerOfferAmount,
        reasoning: `I would like to purchase at ₹${buyerOfferAmount}/${listing.unit}`,
        offerType: 'buyer_offer'
      });
      offerCount++;

      // For active negotiations, add vendor counter-offer
      if (negotiation.status === 'active' && Math.random() > 0.5) {
        const vendorCounterAmount = Math.round((buyerOfferAmount + listing.finalPrice) / 2);
        await Offer.create({
          id: uuidv4(),
          negotiationId: negotiation.id,
          userId: listing.vendorId,
          amount: vendorCounterAmount,
          reasoning: `I can offer ₹${vendorCounterAmount}/${listing.unit} - meeting halfway`,
          offerType: 'vendor_counter'
        });
        offerCount++;
      }

      // For accepted negotiations, add final accepted offer
      if (negotiation.status === 'accepted') {
        const finalAmount = Math.round(listing.finalPrice * 0.95);
        await Offer.create({
          id: uuidv4(),
          negotiationId: negotiation.id,
          userId: listing.vendorId,
          amount: finalAmount,
          reasoning: `Deal accepted at ₹${finalAmount}/${listing.unit}`,
          offerType: 'vendor_counter'
        });
        offerCount++;
      }
    }

    console.log(`✅ Created ${negotiationCount} negotiations with ${offerCount} offers`);

    // Skip ratings for now since they require real transactions
    // We can add them later when we have actual transaction data
    console.log(`⚠️  Skipping ratings (requires real transactions)`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Vendors: ${vendors.length}`);
    console.log(`   - Buyers: ${buyers.length}`);
    console.log(`   - Listings: ${listingCount}`);
    console.log(`   - Negotiations: ${negotiationCount}`);
    console.log(`   - Offers: ${offerCount}`);
    console.log(`   - Ratings: 0 (skipped - requires transactions)`);
    console.log('\n✅ You can now browse listings and test the application!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  const { initializeDatabase } = require('./database');
  
  initializeDatabase()
    .then(() => seedDatabase())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
