/**
 * Database Seeding Script
 * Creates dummy vendors, buyers, and listings for testing
 */

const { User, Listing, TrustScore, Rating } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const crops = [
  { name: 'Wheat', image: '/images/crops/wheat.jpg' },
  { name: 'Rice', image: '/images/crops/rice.jpg' },
  { name: 'Tomato', image: '/images/crops/tomato.jpg' },
  { name: 'Onion', image: '/images/crops/onion.jpg' },
  { name: 'Potato', image: '/images/crops/potato.jpg' },
  { name: 'Cotton', image: '/images/crops/cotton.png' },
  { name: 'Sugarcane', image: '/images/crops/sugarcane.webp' },
  { name: 'Maize', image: '/images/crops/maize.jpeg' },
  { name: 'Soybean', image: '/images/crops/soybean.jpg' },
  { name: 'Groundnut', image: '/images/crops/groundnut.jpg' }
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

    // Create listings
    let listingCount = 0;
    for (const vendor of vendors) {
      const numListings = Math.floor(Math.random() * 3) + 2; // 2-4 listings per vendor
      
      for (let i = 0; i < numListings; i++) {
        const crop = crops[Math.floor(Math.random() * crops.length)];
        const quality = qualities[Math.floor(Math.random() * qualities.length)];
        const basePrice = Math.floor(Math.random() * 2000) + 1000;
        const qualityMultiplier = quality === 'premium' ? 1.2 : quality === 'standard' ? 1.0 : 0.85;
        const demandAdjuster = 0.9 + Math.random() * 0.3; // 0.9 to 1.2
        const finalPrice = Math.round(basePrice * qualityMultiplier * demandAdjuster);

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
          images: JSON.stringify([`/images/crops/${crop.image}`]),
          locationLat: vendor.locationLat,
          locationLng: vendor.locationLng,
          locationAddress: vendor.locationAddress,
          status: 'active'
        });
        listingCount++;
      }
    }

    console.log(`✅ Created ${listingCount} listings`);

    // Create some ratings
    let ratingCount = 0;
    for (const vendor of vendors.slice(0, 5)) {
      for (let i = 0; i < 3; i++) {
        await Rating.create({
          id: uuidv4(),
          vendorId: vendor.id,
          buyerId: buyers[i % buyers.length].id,
          transactionId: uuidv4(), // Mock transaction
          deliveryRating: Math.floor(Math.random() * 2) + 4, // 4-5
          qualityRating: Math.floor(Math.random() * 2) + 4, // 4-5
          comment: 'Great quality and timely delivery!'
        });
        ratingCount++;
      }
    }

    console.log(`✅ Created ${ratingCount} ratings`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Vendors: ${vendors.length}`);
    console.log(`   - Buyers: ${buyers.length}`);
    console.log(`   - Listings: ${listingCount}`);
    console.log(`   - Ratings: ${ratingCount}`);
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
