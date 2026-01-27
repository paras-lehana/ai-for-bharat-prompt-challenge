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
            'HTTP-Referer': 'https://lokmandi.lehana.in',
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
            'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
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
   * Process voice query with AI understanding
   * @param {string} transcribedText - Transcribed text from voice
   * @param {string} language - Language code
   * @returns {Promise<Object>} AI-processed query result
   */
  static async processVoiceQuery(transcribedText, language = 'en') {
    try {
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
        console.log('OpenRouter not configured, using mock');
        return this.mockProcessVoiceQuery(transcribedText);
      }

      console.log('Processing voice query with OpenRouter:', transcribedText);

      const response = await axios.post(
        `${process.env.OPENROUTER_API_URL}/chat/completions`,
        {
          model: process.env.OPENROUTER_MODEL,
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant for an agricultural marketplace. Extract intent and parameters from user queries in any Indian language.

Possible intents:
- price_query: User wants to know crop prices
- create_listing: User wants to sell/list a product
- make_offer: User wants to make an offer on a listing
- search_listings: User wants to search/buy products
- general_help: General questions

Extract these parameters if mentioned:
- cropType: Name of the crop in ENGLISH ONLY. Translate Hindi/regional names to English.
- quantity: Amount with unit (e.g., "100 kg", "50 quintal")
- price: Price mentioned (number only, no currency symbols)
- location: Place name
- qualityTier: premium, standard, or basic

CRITICAL TRANSLATION RULES:
- गेहूं → wheat
- चावल → rice
- टमाटर → tomato
- प्याज → onion
- आलू → potato
- कपास → cotton
- गन्ना → sugarcane
- मक्का → maize
- सोयाबीन → soybean
- मूंगफली → groundnut

NEVER return Hindi crop names. ALWAYS translate to English.

Response format (pure JSON only, no markdown):
{
  "intent": "<intent_type>",
  "cropType": "<crop_name_in_english or null>",
  "quantity": "<quantity or null>",
  "price": "<price or null>",
  "location": "<location or null>",
  "qualityTier": "<tier or null>",
  "confidence": "<high/medium/low>"
}`
            },
            {
              role: 'user',
              content: 'मुझे गेहूं की कीमत बताओ'
            },
            {
              role: 'assistant',
              content: '{"intent":"price_query","cropType":"wheat","quantity":null,"price":null,"location":null,"qualityTier":null,"confidence":"high"}'
            },
            {
              role: 'user',
              content: transcribedText
            }
          ],
          temperature: 0.3,
          max_tokens: 200
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://lokmandi.lehana.in',
            'X-Title': 'Lokal Mandi'
          },
          timeout: 15000
        }
      );

      const content = response.data.choices[0].message.content;
      console.log('OpenRouter response:', content);
      
      try {
        // Remove markdown code blocks if present
        let jsonContent = content.trim();
        if (jsonContent.startsWith('```json')) {
          jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        } else if (jsonContent.startsWith('```')) {
          jsonContent = jsonContent.replace(/```\n?/g, '').trim();
        }
        
        const parsed = JSON.parse(jsonContent);
        console.log('Parsed intent:', parsed);
        return parsed;
      } catch (parseError) {
        console.error('Failed to parse OpenRouter response as JSON:', parseError);
        return this.mockProcessVoiceQuery(transcribedText);
      }
    } catch (error) {
      console.error('AI voice query processing error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
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
    if (lowerText.includes('price') || lowerText.includes('भाव') || lowerText.includes('किंमत') || lowerText.includes('விலை') || lowerText.includes('ధర')) {
      intent = 'price_query';
    } else if (lowerText.includes('buy') || lowerText.includes('search') || lowerText.includes('find') || lowerText.includes('खरीद') || lowerText.includes('खोज')) {
      intent = 'search_listings';
    } else if (lowerText.includes('sell') || lowerText.includes('list') || lowerText.includes('बेच') || lowerText.includes('விற்க')) {
      intent = 'create_listing';
    } else if (lowerText.includes('offer') || lowerText.includes('negotiate') || lowerText.includes('प्रस्ताव')) {
      intent = 'make_offer';
    }

    // Extract crop type
    const crops = ['wheat', 'rice', 'tomato', 'onion', 'potato', 'cotton', 'गेहूं', 'चावल', 'टमाटर', 'प्याज', 'आलू'];
    let cropType = null;
    for (const crop of crops) {
      if (lowerText.includes(crop)) {
        // Normalize to English
        const cropMap = {
          'गेहूं': 'wheat',
          'चावल': 'rice',
          'टमाटर': 'tomato',
          'प्याज': 'onion',
          'आलू': 'potato'
        };
        cropType = cropMap[crop] || crop;
        break;
      }
    }

    // Extract quantity
    const quantityMatch = text.match(/(\d+)\s*(kg|किलो|quintal|टन)/i);
    const quantity = quantityMatch ? `${quantityMatch[1]} ${quantityMatch[2]}` : null;

    // Extract price
    const priceMatch = text.match(/₹?\s*(\d+)/);
    const price = priceMatch ? parseInt(priceMatch[1]) : null;

    return {
      intent,
      cropType,
      quantity,
      price,
      location: null,
      qualityTier: null,
      confidence: 'medium'
    };
  }
}

module.exports = AIService;
