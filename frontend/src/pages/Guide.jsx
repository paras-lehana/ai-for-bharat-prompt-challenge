import React, { useState, useContext, useEffect } from 'react';
import { FiBook, FiStar, FiCode, FiCheckCircle, FiGlobe, FiBarChart, FiZap } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Guide() {
  const { user } = useContext(AuthContext);
  const [selectedLanguage, setSelectedLanguage] = useState(user?.languagePreference || 'en');
  const [translatedContent, setTranslatedContent] = useState({});
  const [translating, setTranslating] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'bn', name: 'বাংলা (Bengali)' }
  ];

  const guides = [
    {
      title: 'Quick Start Guide',
      icon: <FiZap className="w-8 h-8" />,
      description: 'Get started in 5 minutes',
      color: 'from-blue-500 to-blue-600',
      content: `
# Quick Start Guide

## For Vendors (Sellers)

1. **Register**: Login with your phone number
2. **Create Listing**: Add your crop details, photos, and price
3. **Receive Offers**: Buyers will make offers on your listing
4. **Negotiate**: Use AI-powered suggestions to negotiate fairly
5. **Complete Sale**: Confirm delivery and get paid

## For Buyers

1. **Register**: Login with your phone number
2. **Search Products**: Browse or use voice search
3. **Make Offer**: Negotiate price with vendors
4. **Complete Purchase**: Confirm delivery and rate vendor

## Voice Features

- Click "Kisaan Bot" button
- Speak your query in any Indian language
- Get instant price information
- Search for products by voice
      `
    },
    {
      title: 'Features Overview',
      icon: <FiStar className="w-8 h-8" />,
      description: 'All platform features explained',
      color: 'from-purple-500 to-purple-600',
      content: `
# Platform Features

## 1. Voice-Based Interface
- Speak in 22 Indian languages
- Get instant price information
- Search products by voice
- No reading required

## 2. AI Negotiation Assistant
- Smart counter-offer suggestions
- Fair pricing recommendations
- Market data analysis
- Transparent reasoning

## 3. Quality-Based Pricing
- Premium, Standard, Basic tiers
- Transparent pricing formula
- Market demand adjustments
- Clear price breakdowns

## 4. Trust System
- Vendor ratings and reviews
- Delivery and quality scores
- Verified seller badges
- Dispute resolution

## 5. Peer Discovery
- Find nearby vendors
- Collaborate on bulk orders
- Share market insights
- Build community

## 6. Government Integration
- Live eNAM prices
- ODOP product badges
- GeM documentation help
- Market intelligence

## 7. Multilingual Support
- 22 Indian languages
- Automatic translation
- Voice and text support
- Cultural adaptation
      `
    },
    {
      title: 'How to Use Voice Search',
      icon: <FiGlobe className="w-8 h-8" />,
      description: 'Voice search tutorial',
      color: 'from-green-500 to-green-600',
      content: `
# Voice Search Guide

## Step 1: Click Kisaan Bot
- Find the "🤖 Kisaan Bot" button on home page
- Click to open voice interface

## Step 2: Grant Microphone Permission
- Browser will ask for microphone access
- Click "Allow" to enable voice features

## Step 3: Speak Your Query
- Click the microphone button
- Speak clearly in your language
- Examples:
  - "टमाटर का भाव क्या है?" (Hindi)
  - "What is the price of tomato?"
  - "ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?" (Kannada)

## Step 4: Confirm Action
- Bot will show what it understood
- Confirm to proceed
- Or cancel and try again

## Supported Actions
- Check prices
- Search products
- Create listings
- Make offers
      `
    },
    {
      title: 'Negotiation Tips',
      icon: <FiCheckCircle className="w-8 h-8" />,
      description: 'Get the best deals',
      color: 'from-orange-500 to-orange-600',
      content: `
# Negotiation Best Practices

## For Buyers

### Making Offers
- Research market prices first
- Start with reasonable offer
- Use AI suggestions as guide
- Be respectful in communication

### Negotiating
- Explain your reasoning
- Consider quality tier
- Check vendor trust score
- Be willing to compromise

## For Vendors

### Responding to Offers
- Review AI counter-offer suggestions
- Consider your costs
- Check market trends
- Respond quickly (affects trust score)

### Accepting Offers
- Ensure profit margin
- Consider repeat business
- Build long-term relationships
- Maintain quality standards

## AI Assistant Features
- Fair price range calculation
- Market data analysis
- Regional pricing comparison
- Reasoning for suggestions
      `
    },
    {
      title: 'Trust & Safety',
      icon: <FiCheckCircle className="w-8 h-8" />,
      description: 'Stay safe while trading',
      color: 'from-teal-500 to-teal-600',
      content: `
# Trust & Safety Guide

## Trust Score System

### Components
- **Delivery (40%)**: On-time delivery rate
- **Quality (30%)**: Product quality match
- **Response (20%)**: Reply speed
- **Fair Pricing (10%)**: Price vs market average

### Badges
- **Trusted Vendor**: 4.5+ score, 20+ transactions
- **Verified Seller**: 4.0+ score, 50+ transactions

## Safety Tips

### For Buyers
- Check vendor trust score
- Read reviews carefully
- Start with small orders
- Confirm delivery before payment
- Report issues promptly

### For Vendors
- Provide accurate descriptions
- Upload clear photos
- Respond quickly to messages
- Deliver on time
- Maintain quality standards

## Dispute Resolution
- Raise dispute within 48 hours
- Submit evidence (photos, messages)
- AI analyzes all evidence
- Fair resolution recommended
- Human review available
      `
    },
    {
      title: 'Technical Support',
      icon: <FiCode className="w-8 h-8" />,
      description: 'Troubleshooting and help',
      color: 'from-indigo-500 to-indigo-600',
      content: `
# Technical Support

## Common Issues

### Voice Not Working
- Check microphone permissions
- Ensure stable internet
- Try different browser
- Use text input as fallback

### Images Not Loading
- Check internet connection
- Clear browser cache
- Try refreshing page
- Report if persists

### Login Issues
- Verify phone number format
- Check OTP expiry (5 minutes)
- Request new OTP
- Contact support if blocked

## Browser Requirements
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Internet Requirements
- Minimum: 2G connection
- Recommended: 3G or better
- Voice features: 4G recommended

## Contact Support
- Email: support@multilingualmandi.in
- Phone: +91-XXXXXXXXXX
- Hours: 9 AM - 6 PM IST
      `
    }
  ];

  const [selectedGuide, setSelectedGuide] = useState(null);

  // Translate content when language changes
  useEffect(() => {
    if (selectedLanguage !== 'en' && selectedGuide) {
      translateContent(selectedGuide.content);
    }
  }, [selectedLanguage, selectedGuide]);

  const translateContent = async (text) => {
    if (selectedLanguage === 'en') {
      return text;
    }

    // Check if already translated
    const cacheKey = `${selectedGuide.title}-${selectedLanguage}`;
    if (translatedContent[cacheKey]) {
      return translatedContent[cacheKey];
    }

    setTranslating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/voice/translate`, {
        text: text,
        targetLanguage: selectedLanguage
      });
      
      const translated = response.data.translatedText || text;
      setTranslatedContent(prev => ({
        ...prev,
        [cacheKey]: translated
      }));
      return translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    } finally {
      setTranslating(false);
    }
  };

  const getDisplayContent = () => {
    if (!selectedGuide) return '';
    if (selectedLanguage === 'en') return selectedGuide.content;
    
    const cacheKey = `${selectedGuide.title}-${selectedLanguage}`;
    return translatedContent[cacheKey] || selectedGuide.content;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">📚 Help & Documentation</h1>
        <p className="text-xl text-gray-600 mb-6">
          Everything you need to know about Multilingual Mandi
        </p>

        {/* Language Selector */}
        <div className="inline-flex items-center space-x-4 bg-white rounded-lg shadow-md p-4">
          <label className="font-medium text-gray-700">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500">
            Content automatically translated
          </span>
        </div>
      </div>

      {/* Guide Cards or Selected Guide */}
      {!selectedGuide ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {guides.map((guide, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGuide(guide)}
              className="block bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden text-left"
            >
              <div className={`bg-gradient-to-r ${guide.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  {guide.icon}
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                    Read →
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{guide.description}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <button
            onClick={() => setSelectedGuide(null)}
            className="mb-6 text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to all guides
          </button>
          
          {translating && selectedLanguage !== 'en' && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-700">
              🔄 Translating to {languages.find(l => l.code === selectedLanguage)?.name}...
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 text-gray-900" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mb-3 mt-6 text-gray-800" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 mt-4 text-gray-700" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                code: ({node, ...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />,
              }}
            >
              {getDisplayContent()}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/browse"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-2">🛒 Browse Listings</h3>
            <p className="text-sm opacity-90">Explore available products</p>
          </a>
          
          <a
            href="/price-info"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-2">💰 Price Information</h3>
            <p className="text-sm opacity-90">Check current market prices</p>
          </a>
          
          <a
            href="/create-listing"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-2">➕ Create Listing</h3>
            <p className="text-sm opacity-90">List your products</p>
          </a>
          
          <a
            href="/negotiations"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-2">💬 My Negotiations</h3>
            <p className="text-sm opacity-90">View your offers and deals</p>
          </a>
        </div>
      </div>

      {/* Platform Features */}
      <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Platform Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-bold text-lg mb-3 text-primary-600">Voice & Language</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🎤 22 Indian Languages</li>
              <li>🗣️ Voice Commands</li>
              <li>🌐 Auto Translation</li>
            </ul>
          </div>
          
          <div className="text-center">
            <h3 className="font-bold text-lg mb-3 text-primary-600">Smart Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>🤖 AI Negotiation Help</li>
              <li>💰 Fair Pricing</li>
              <li>📊 Market Intelligence</li>
            </ul>
          </div>
          
          <div className="text-center">
            <h3 className="font-bold text-lg mb-3 text-primary-600">Trust & Safety</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>⭐ Vendor Ratings</li>
              <li>🛡️ Dispute Resolution</li>
              <li>✅ Verified Sellers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
