/**
 * FILE: backend/src/services/AIService.js
 * 
 * PURPOSE: AI service for OpenRouter integration
 * Provides AI-powered features like listing generation and negotiation analysis
 */

const axios = require('axios');

class AIService {
  /**
   * Generate listing description using AI
   * @param {string} cropType - Type of crop
   * @param {number} quantity - Quantity
   * @param {string} qualityTier - Quality tier
   * @param {string} location - Location
   * @returns {Promise<string>} Generated description
   */
  static async generateListingDescription(cropType, quantity, qualityTier, location) {
    try {
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
        return this.mockGenerateDescription(cropType, quantity, qualityTier, location);
      }

      const response = await axios.post(
        `${process.env.OPENROUTER_API_URL}/chat/completions`,
        {
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: `Generate a compelling 2-sentence product description for ${quantity} units of ${cropType} (${qualityTier} quality) from ${location} for an agricultural marketplace. Focus on freshness and quality.`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lokalmandi.lehana.in',
            'X-Title': 'Lokal Mandi'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI description generation error:', error.message);
      return this.mockGenerateDescription(cropType, quantity, qualityTier, location);
    }
  }

  /**
   * Analyze negotiation and suggest counter-offer
   * @param {number} listingPrice - Original listing price
   * @param {number} offerPrice - Buyer's offer
   * @param {Object} marketData - Market data
   * @returns {Promise<Object>} AI analysis with suggested counter-offer
   */
  static async analyzeNegotiation(listingPrice, offerPrice, marketData = {}) {
    try {
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
        return this.mockAnalyzeNegotiation(listingPrice, offerPrice);
      }

      const marketAvg = marketData.average || listingPrice;
      
      const response = await axios.post(
        `${process.env.OPENROUTER_API_URL}/chat/completions`,
        {
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: 'user',
              content: `Analyze this agricultural product negotiation:
- Listing price: ₹${listingPrice}
- Buyer offer: ₹${offerPrice}
- Market average: ₹${marketAvg}

Provide:
1. A fair counter-offer price (just the number)
2. Brief reasoning (1 sentence)

Format: {"counterOffer": <number>, "reasoning": "<text>"}`
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lokalmandi.lehana.in',
            'X-Title': 'Lokal Mandi'
          }
        }
      );

      const content = response.data.choices[0].message.content;
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(content);
        return {
          counterOffer: parsed.counterOffer,
          reasoning: parsed.reasoning,
          confidence: 'high'
        };
      } catch {
        // Fallback if not JSON
        return this.mockAnalyzeNegotiation(listingPrice, offerPrice);
      }
    } catch (error) {
      console.error('AI negotiation analysis error:', error.message);
      return this.mockAnalyzeNegotiation(listingPrice, offerPrice);
    }
  }

  /**
   * Process voice query with Hybrid Detection (Regex First -> LLM Fallback)
   * @param {string} transcribedText - Transcribed text
   * @param {string} language - Language code
   * @returns {Promise<Object>} Intent Result
   */
  static async processVoiceQuery(transcribedText, language = 'en') {
    // 1. Check for API key presence
    if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
        console.warn('⚠️ No OpenRouter API Key found. Using strict mock fallback.');
        return this.mockProcessVoiceQuery(transcribedText);
    }

    // 2. Direct LLM Call
    try {
      console.log(`🤖 Consulting LLM (${process.env.OPENROUTER_MODEL || 'Gemma'}) for intent detection...`);

      const response = await axios.post(
        `${process.env.OPENROUTER_API_URL}/chat/completions`,
        {
          model: process.env.OPENROUTER_MODEL || "google/gemma-2-9b-it:free",
          messages: [
            {
              role: 'user',
              content: `You are an AI assistant for an Indian farmer marketplace. 
              Output JSON ONLY. No markdown.
              
                Tasks:
              1. Extract intent (lowercase): search_listings, price_query, create_listing, make_offer, news_query, general_help
              
              2. Extract entities (at top level): 
                 - cropType (Standard English Name e.g. 'Wheat', 'Rice', 'Tomato', 'Mustard', 'Soybean')
                 - quantity (number/string)
                 - price (number)
                 - location (string)
                 - qualityTier (premium/standard/basic)

              3. Generate displayMessage (English): Natural confirmation message.

              IMPORTANT: Output FLAT JSON with keys: intent, cropType, quantity, price, location, qualityTier, displayMessage. NO NESTING.
              
              Example: {"intent": "create_listing", "cropType": "Tomato", "price": 10, "displayMessage": "List Tomato at 10?"}

              Now process this query: "${transcribedText}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lokalmandi.lehana.in',
            'X-Title': 'Lokal Mandi'
          },
          timeout: 8000
        }
      );

      const content = response.data.choices[0].message.content;
      console.log('🤖 Raw LLM Response:', content);
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
         try {
             const parsed = JSON.parse(jsonMatch[0]);
             // Force correct crop case
             if (parsed.cropType) {
                 parsed.cropType = parsed.cropType.charAt(0).toUpperCase() + parsed.cropType.slice(1).toLowerCase();
             }
             return { ...parsed, confidence: 'high' };
         } catch (e) {
             console.error('Failed to parse extracted JSON:', e);
         }
      }
      
      console.warn('⚠️ LLM returned unusable format. Using local fallback.');
      return this.mockProcessVoiceQuery(transcribedText);

    } catch (error) {
      console.error('❌ LLM Request failed, using local fallback:', error.message);
      return this.mockProcessVoiceQuery(transcribedText);
    }
  }

  // Mock implementations for fallback
  static mockGenerateDescription(cropType, quantity, qualityTier, location) {
    return `Fresh ${cropType} from ${location}. High quality ${qualityTier} grade, ${quantity} units available for immediate delivery.`;
  }

  static mockAnalyzeNegotiation(listingPrice, offerPrice) {
    const diff = listingPrice - offerPrice;
    const counterOffer = Math.round(listingPrice - (diff * 0.6));
    
    return {
      counterOffer,
      reasoning: `Based on market conditions, this counter-offer balances fair pricing with your profit margin.`,
      confidence: 'medium'
    };
  }

  static mockProcessVoiceQuery(text) {
    const lowerText = text.toLowerCase();
    
    let intent = 'general_help';
    
    // Intent keywords for different languages
    const priceKeywords = ['price', 'rate', 'cost', 'how much', 'भाव', 'दाम', 'कीमत', 'किंमत', 'விலை', 'ధర', 'ಬೆಲೆ', 'ਦਾਮ', 'દર', 'দর'];
    const buyKeywords = ['buy', 'search', 'want', 'find', 'need', 'खरीद', 'खोज', 'चाहिए', 'வாங்க', 'కొనండి', 'ಖರೀದಿ', 'ਤਲਾਸ਼', 'શોધ', 'খুঁজুন'];
    const sellKeywords = ['sell', 'list', 'add', 'create', 'post', 'बेच', 'डालना', 'सूची', 'वிற்க', 'అమ్మకం', 'ಮಾರಾಟ', 'ਵੇਚੋ', 'વેચવું', 'বিক্রি'];
    const offerKeywords = ['offer', 'negotiate', 'deal', 'bargain', 'price', 'प्रस्ताव', 'सौदा', 'मोलभाव', 'कम करो', 'பேரம்', 'అవకాశం', 'ఒప్పಂದ', 'ਸੌਦਾ', 'સોદો', 'ডিল'];
    const newsKeywords = ['news', 'weather', 'advisory', 'market', 'समाचार', 'खबर', 'मंडी', 'मौसम', 'सलाह', 'जानकारी', 'अறிக்கை', 'వార్తలు', 'ಸುದ್ದಿ', 'ਖਬਰ', 'સમાચાર', 'সংবাদ'];

    if (priceKeywords.some(k => lowerText.includes(k))) {
      intent = 'price_query';
    } else if (sellKeywords.some(k => lowerText.includes(k))) {
      intent = 'create_listing';
    } else if (buyKeywords.some(k => lowerText.includes(k))) {
      intent = 'search_listings';
    } else if (offerKeywords.some(k => lowerText.includes(k))) {
      intent = 'make_offer';
    } else if (newsKeywords.some(k => lowerText.includes(k))) {
      intent = 'news_query';
    }

    // Extract crop type with extensive mapping
    const cropsMapping = {
      'wheat': ['wheat', 'gehun', 'gehu', 'गेहूं', 'கோதுமை', 'గోధుమ', 'ಗೋದಧಿ', 'ਕਣਕ', 'ઘઉં', 'গম'],
      'rice': ['rice', 'chawal', 'dhan', 'चावल', 'धान', 'അരിസി', 'వరి', 'ಅಕ್ಕಿ', 'ਚਾਵਲ', 'ચોખા', 'ভাত'],
      'tomato': ['tomato', 'tamatar', 'टमाटर', 'தக்காளி', 'టమాటా', 'ಟೊಮೆಟೊ', 'ਟਮਾਟਰ', 'ટામેટા', 'টমেটো'],
      'onion': ['onion', 'pyaz', 'kanda', 'प्याज', 'कांदा', 'வெங்காயம்', 'ఉల్లిపాయ', 'ಈರುಳ್ಳಿ', 'ਪਿਆਜ਼', 'ડુંગળી', 'পেঁয়াজ'],
      'potato': ['potato', 'aloo', 'आलू', 'உருளைக்கிழங்கு', 'బంగాళాదుంప', 'ಆಲೂಗಡ್ಡೆ', 'ਆਲੂ', 'બટાકા', 'আলু'],
      'cotton': ['cotton', 'kapas', 'ruyi', 'कपास', 'रूई', 'பருத்தி', 'పత్తి', 'ಹತ್ತಿ', 'ਕਪਾਹ', 'કપાસ', 'তুলা'],
      'sugarcane': ['sugarcane', 'ganna', 'गन्ना', 'கரும்பு', 'చెరకు', 'ಕಬ್ಬು', 'ਗੰਨਾ', 'શેરડી', 'আখ'],
      'maize': ['maize', 'corn', 'makka', 'मकई', 'मक्का', 'மக்காச்சோளம்', 'మొక్కజొన్న', 'ಮೆಕ್ಕೆಜೋಳ', 'ਮੱਕੀ', 'મકાઈ', 'ভুট্টা'],
      'soybean': ['soybean', 'soya', 'सोयाबीन', 'சோயாபீன்', 'సోయాబీన్', 'ಸೋಯಾಬೀನ್', 'ਸੋਇਆਬੀਨ', 'સોયાબીન', 'সয়াবিন'],
      'groundnut': ['groundnut', 'peanut', 'mungfali', 'मूंगफली', 'நிலக்கடலை', 'వేరుశనగ', 'ನೆಲಗಡಲೆ', 'ਮੂੰਗਫਲੀ', 'મગફળી', 'চিনাবাদাম']
    };

    let cropType = null;
    for (const [english, keywords] of Object.entries(cropsMapping)) {
      if (keywords.some(k => lowerText.includes(k))) {
        cropType = english;
        break;
      }
    }

    // Extract quantity with improved regex
    const quantityMatch = text.match(/(\d+)\s*(kg|किलो|quintal|टन|ton|kg|gm|gram|पाव|किलोग्राम)/i);
    const quantity = quantityMatch ? `${quantityMatch[1]} ${quantityMatch[2]}` : null;

    // Extract price with improved regex
    const priceMatch = text.match(/(₹|rs|रु|रुपये)?\s*(\d+)/i);
    const price = priceMatch ? parseInt(priceMatch[2]) : null;

    // Default crop if not found but intent is price/search
    if (!cropType && (intent === 'price_query' || intent === 'search_listings')) {
        cropType = 'Wheat'; // Generic fallback
    }

    return {
      intent,
      cropType,
      quantity,
      price,
      location: null,
      qualityTier: 'standard',
      confidence: 'medium'
    };
  }

  /**
   * Generate page summary using LLM
   * @param {string} pageType - Type of page (listing_detail, negotiations, analytics)
   * @param {Object} data - Page data
   * @param {string} languageCode - Language to generate summary in
   * @returns {Promise<string>} Summary text
   */
  static async generatePageSummary(pageType, data, languageCode = 'en') {
    try {
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
        return this.mockGeneratePageSummary(pageType, data);
      }

      console.log(`🤖 Consulting LLM for page summary (${pageType})...`);

      // Define page-specific prompts
      const pagePrompts = {
        'listing_detail': `This is a product listing. 
          Crop: ${data.cropType || 'Crop'}, Quantity: ${data.quantity || 'N/A'}, 
          Price: ₹${data.finalPrice || data.basePrice || 'N/A'} per ${data.unit || 'unit'}, 
          Quality: ${data.qualityTier || 'Standard'}, 
          Location: ${data.locationAddress || 'Local Mandi'}.
          Focus: Tell the farmer about this deal and suggest making an offer if the price is good.`,
          
        'negotiations': `This is a list of active negotiations.
          Total Active: ${data.length || 0}.
          Key Crops: ${[...new Set(data.map(n => n.listing?.cropType || 'Crop'))].slice(0, 3).join(', ')}.
          Focus: Tell the farmer about their active deals. Mention if any need immediate attention (e.g. pending ones).`,

        'transactions': `This is the transaction history.
          Total Transactions: ${data.length || 0}.
          Completed: ${data.filter(t => t.status === 'delivered').length}.
          Focus: Summarize their trading history. Mention the total value of successful deals if available in the data.`,

        'messages': `These are message threads.
          Total Conversations: ${data.length || 0}.
          Unread: ${data.reduce((acc, curr) => acc + (curr.unreadCount || 0), 0)}.
          Focus: Inform the user if they have new messages. Encourage them to reply to potential buyers/vendors.`,
          
        'browse': `This is a search result for ${data.criteria?.cropType || 'crops'}.
          Found ${data.count || 0} listings.
          Focus: Suggest browsing through these options or refining the search for better prices.`,
          
        'analytics': `This is the farmer's personal dashboard.
          Total Sales: ₹${data.totalSales || 0}.
          Active Listings: ${data.activeListings || 0}.
          Pending Negotiations: ${data.pendingNegotiations || 0}.
          Trust Score: ${data.trustScore || 'N/A'}/5.
          Focus: Congratulate them on their sales/trust score. Mention pending negotiations that need attention.`,
      };

      const contextPrompt = pagePrompts[pageType] || `Page Content: ${JSON.stringify(data)}`;

      const languageNames = {
        'hi': 'Hindi (Devanagari script)',
        'te': 'Telugu (Telugu script)',
        'ta': 'Tamil (Tamil script)',
        'mr': 'Marathi (Devanagari script)',
        'bn': 'Bengali (Bengali script)',
        'pa': 'Punjabi (Gurmukhi script)',
        'gu': 'Gujarati (Gujarati script)',
        'kn': 'Kannada (Kannada script)',
        'ml': 'Malayalam (Malayalam script)'
      };

      const languageName = languageNames[languageCode] || 'Hindi (Devanagari script)';

      const systemPrompt = `You are 'Kisaan Bhai', a friendly AI assistant for Indian farmers.
        
        CRITICAL SCRIPT RULE:
        - You MUST write your entire response using the script of ${languageName}.
        - STRICTLY NO ENGLISH ALPHABETS (A-Z) allowed. 
        - Even greetings like 'Hello' must be written in ${languageName} (e.g., 'नमस्ते' for Hindi).
        - Use SPECIFIC numbers (e.g. ₹45250, 4.8) and details from the context. Do not be generic.
        
        SUMMARY STYLE:
        - Start with a warm greeting.
        - Summarize the provided data using the exact numbers.
        - Suggest one helpful next step.
        - Keep it under 50 words.
        
        EXAMPLE (If Hindi):
        नमस्ते किसान भाई! आपकी टमाटर की फसल के लिए अच्छी खबर है। अभी मंडी में दाम बढ़ रहे हैं। आप अपनी उपज 20 रुपये किलो में बेच सकते हैं। आज ही अपनी फसल लिस्ट करें।`;

      const response = await axios.post(
        `${process.env.OPENROUTER_API_URL}/chat/completions`,
        {
          model: process.env.OPENROUTER_SUMMARY_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: `DATA TO SUMMARIZE: ${contextPrompt}
              
              REMINDER: Respond ONLY in the script of ${languageName}. Absolutely NO English characters.`
            }
          ],
          temperature: 0.4,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lokalmandi.lehana.in',
            'X-Title': 'Lokal Mandi'
          },
          timeout: 12000
        }
      );

      let content = response.data.choices[0].message.content;
      
      // Strip markdown for TTS safety
      content = content.replace(/\*\*?|_|#|`/g, '');
      
      return content;
    } catch (error) {
      console.error('LLM summary generation failed:', error.message);
      return this.mockGeneratePageSummary(pageType, data, languageCode);
    }
  }

  static mockGeneratePageSummary(pageType, data, languageCode = 'hi') {
      const isHindi = languageCode === 'hi';
      
      if (pageType === 'listing_detail') {
          return isHindi 
            ? `नमस्ते किसान भाई। यह ${data.cropType || 'फसल'} ₹${data.finalPrice || 0} में बिक रही है। इसकी गुणवत्ता अच्छी है। आप बोली लगा सकते हैं या अभी खरीद सकते हैं।`
            : `Hello Kisaan Bhai. This is ${data.cropType || 'a crop'} selling for ₹${data.finalPrice || 0}. It is good quality. You can make an offer or buy it now.`;
      }
      
      if (pageType === 'analytics') {
          return isHindi
            ? `नमस्ते किसान भाई। आपके इलाके में ${data.cropType || 'फसल'} की मांग ${data.demandAdjuster > 1 ? 'ज्यादा' : 'सामान्य'} है। अभी बेचना फायदेमंद हो सकता है।`
            : `Hello Kisaan Bhai. Demand for ${data.cropType || 'crops'} is ${data.demandAdjuster > 1 ? 'high' : 'stable'} in your area. It might be a good time to sell.`;
      }

      return isHindi
        ? "नमस्ते किसान भाई। यहाँ इस पेज का सारांश दिया गया है। कृपया विवरण ध्यान से देखें।"
        : "Hello Kisaan Bhai. Here is the summary of this page. Please check the details carefully.";
  }
}

module.exports = AIService;
