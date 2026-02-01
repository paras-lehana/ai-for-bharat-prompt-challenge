const { User, Listing, Negotiation, Message, sequelize } = require('../models');
const { v4: uuidv4 } = require('uuid');

async function boost() {
  console.log('🚀 Starting Data Booster...');
  
  try {
    // 1. Find our primary users
    const farmer = await User.findOne({ where: { phoneNumber: "+919876543210" } });
    const buyer = await User.findOne({ where: { phoneNumber: "+919876543212" } });
    
    if (!farmer || !buyer) {
      console.error('❌ Could not find Farmer/Buyer users. Run seed first.');
      return;
    }
    
    console.log(`✅ Found Farmer (${farmer.id}) and Buyer (${buyer.id})`);
    
    const threadId = [farmer.id, buyer.id].sort().join(':');

    // 2. Ensure we have listings for the farmer
    let listings = await Listing.findAll({ where: { vendorId: farmer.id } });
    if (listings.length < 5) {
      console.log('📦 Creating more listings for Farmer...');
      const crops = ['Tomato', 'Onion', 'Potato', 'Wheat', 'Rice'];
      for (const crop of crops) {
        await Listing.create({
          id: uuidv4(),
          vendorId: farmer.id,
          cropType: crop,
          quantity: 100 + Math.floor(Math.random() * 500),
          unit: 'Kg',
          basePrice: 20 + Math.floor(Math.random() * 50),
          finalPrice: 20 + Math.floor(Math.random() * 50),
          qualityTier: ['premium', 'standard', 'basic'][Math.floor(Math.random() * 3)],
          qualityMultiplier: 1.0,
          demandAdjuster: 1.0,
          description: `Fresh ${crop} from my local farm in Nasik. High quality guaranteed.`,
          status: 'active',
          locationLat: 19.9975,
          locationLng: 73.7898,
          locationAddress: 'Nasik, Maharashtra'
        });
      }
      listings = await Listing.findAll({ where: { vendorId: farmer.id } });
    }
    
    // 3. Create 20 Negotiations
    console.log('🤝 Creating 20 Negotiations...');
    const currentNegs = await Negotiation.count({ where: { buyerId: buyer.id } });
    if (currentNegs < 20) {
      for (let i = 0; i < 20 - currentNegs; i++) {
        const listing = listings[i % listings.length];
        const lastOffer = Math.round(listing.basePrice * (0.8 + Math.random() * 0.4));
        
        await Negotiation.create({
          id: uuidv4(),
          listingId: listing.id,
          buyerId: buyer.id,
          vendorId: farmer.id,
          initialOffer: Math.round(listing.basePrice * 0.8),
          lastOffer: lastOffer,
          status: ['pending', 'countered', 'accepted'][Math.floor(Math.random() * 3)],
          rounds: Math.floor(Math.random() * 5) + 1,
          expiresAt: new Date(Date.now() + 86400000)
        });
      }
    }
    
    // 4. Create 50 Messages
    console.log('💬 Creating 50 Messages...');
    const hindiMessages = [
      "नमस्ते, क्या आपके पास और टमाटर हैं?",
      "जी हां, कल सुबह ताज़ा माल आएगा।",
      "क्या आप ₹25 प्रति किलो दे सकते हैं?",
      "नहीं भाई, ₹28 से कम नहीं हो पाएगा। माल बहुत अच्छा है।",
      "ठीक है, मैं 200 किलो लूंगा।",
      "धन्यवाद, मैं गाड़ी लगवा देता हूं।",
      "पेमेंट कैसे करेंगे?",
      "मैं ऑनलाइन ट्रांसफर कर दूंगा।"
    ];
    
    const englishMessages = [
      "Hello, interested in your wheat listing.",
      "Yes, it is high quality premium grade.",
      "Can we negotiate on the shipping?",
      "Sure, if you buy more than 500kg.",
      "I will take 600kg then.",
      "Great, I will confirm the deal."
    ];
    
    // Clear old messages to avoid clutter
    await Message.destroy({ where: { threadId: threadId } });

    for (let i = 0; i < 50; i++) {
        const isFarmerSender = Math.random() > 0.5;
        const msgList = Math.random() > 0.4 ? hindiMessages : englishMessages;
        const sender = isFarmerSender ? farmer : buyer;
        const content = msgList[Math.floor(Math.random() * msgList.length)];
        const isHindi = content.includes('न'); // simple check for Hindi chars
        
        await Message.create({
            id: uuidv4(),
            threadId: threadId,
            senderId: sender.id,
            recipientId: isFarmerSender ? buyer.id : farmer.id,
            content: content,
            originalLanguage: isHindi ? 'hi' : 'en',
            isRead: Math.random() > 0.3,
            createdAt: new Date(Date.now() - (50 - i) * 3600000) // 1 hour apart
        });
    }
    
    console.log('✅ Booster complete! Platform is now full of life.');
    
  } catch (err) {
    console.error('❌ Booster error:', err);
  } finally {
    process.exit();
  }
}

boost();
