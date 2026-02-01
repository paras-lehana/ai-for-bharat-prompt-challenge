import React, { useState, useContext, useEffect } from 'react';
import { FiBook, FiStar, FiCode, FiCheckCircle, FiGlobe, FiBarChart, FiZap } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import TranslatedText from '../components/TranslatedText';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Guide() {
  const { user } = useContext(AuthContext);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('i18nextLng') || user?.languagePreference || 'en');
  const [translatedContent, setTranslatedContent] = useState({});
  const [translating, setTranslating] = useState(false);

  // Sync with i18next global state
  useEffect(() => {
    // Initial sync
    const currentLng = localStorage.getItem('i18nextLng') || 'en';
    setSelectedLanguage(currentLng);
  }, []);

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

  // Translate content when language changes (ONLY if not English)
  useEffect(() => {
    // CRITICAL: Do NOT translate if English is selected
    if (selectedLanguage === 'en') {
      setTranslating(false);
      return;
    }

    // Only translate for non-English languages AND when a guide is selected
    if (selectedGuide && selectedGuide.content) {
      translateContent(selectedGuide.content, selectedGuide.title);
    }
  }, [selectedLanguage, selectedGuide]);

  const translateContent = async (text, title) => {
    const cacheKey = `${title}-${selectedLanguage}`;

    // Check if already translated
    if (translatedContent[cacheKey]) {
      return;
    }

    setTranslating(true);

    try {
      const requestData = {
        text: text,
        targetLanguage: selectedLanguage
      };

      const response = await axios.post(`${API_BASE_URL}/voice/translate`, requestData);
      const translated = response.data.translatedText || text;

      setTranslatedContent(prev => ({
        ...prev,
        [cacheKey]: translated
      }));
    } catch (error) {
      console.error('[Guide] Translation error:', error.message);
    } finally {
      setTranslating(false);
    }
  };

  const getDisplayContent = () => {
    if (!selectedGuide || !selectedGuide.content) return '';
    if (selectedLanguage === 'en') return selectedGuide.content;

    const cacheKey = `${selectedGuide.title}-${selectedLanguage}`;
    const translated = translatedContent[cacheKey];

    if (translated && translated.trim().length > 0) return translated;
    return selectedGuide.content;
  };

  const handleLanguageChange = (lng) => {
    setSelectedLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Header */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-block mb-4">
          <div className="text-6xl mb-4 animate-bounce-subtle">📚</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
          <TranslatedText language={selectedLanguage}>Help & Documentation</TranslatedText>
        </h1>
        <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
          <TranslatedText language={selectedLanguage}>Everything you need to know about Lokal Mandi - Your multilingual agricultural marketplace</TranslatedText>
        </p>

        {/* Language Selector */}
        <div className="inline-flex items-center space-x-4 bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition-shadow duration-300">
          <label className="font-medium text-gray-700 flex items-center space-x-2">
            <span className="text-2xl">🌐</span>
            <span><TranslatedText language={selectedLanguage}>Language</TranslatedText>:</span>
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="border-2 border-primary-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-primary-400"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full text-xs">
            ✨ <TranslatedText language={selectedLanguage}>Auto-translated content</TranslatedText>
          </span>
        </div>
      </div>

      {/* Guide Cards or Selected Guide */}
      {!selectedGuide ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-slide-up">
          {guides.map((guide, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedGuide(guide)}
              className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 overflow-hidden text-left group"
            >
              <div className={`bg-gradient-to-r ${guide.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="transform group-hover:scale-110 transition-transform duration-300">
                    {guide.icon}
                  </div>
                  <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <TranslatedText language={selectedLanguage}>Read</TranslatedText> →
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 relative z-10">
                  <TranslatedText language={selectedLanguage}>{guide.title}</TranslatedText>
                </h3>
              </div>
              <div className="p-6 bg-gradient-to-br from-white to-gray-50 group-hover:from-gray-50 group-hover:to-white transition-colors duration-300">
                <p className="text-gray-600 group-hover:text-gray-800 transition-colors">
                  <TranslatedText language={selectedLanguage}>{guide.description}</TranslatedText>
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 animate-fade-in border border-gray-100">
          <button
            onClick={() => setSelectedGuide(null)}
            className="mb-6 text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2 group transition-all duration-200"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
            <span><TranslatedText language={selectedLanguage}>Back to all guides</TranslatedText></span>
          </button>

          {translating && selectedLanguage !== 'en' && (
            <div className="mb-4 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4 text-blue-700 flex items-center space-x-3 animate-pulse">
              <div className="text-2xl">🔄</div>
              <div>
                <div className="font-medium"><TranslatedText language={selectedLanguage}>Translating content...</TranslatedText></div>
                <div className="text-sm"><TranslatedText language={selectedLanguage}>Converting content</TranslatedText></div>
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 border-b-4 border-primary-500 pb-3" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-8 text-gray-800 flex items-center space-x-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl md:text-2xl font-bold mb-3 mt-6 text-gray-700" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 text-gray-700 leading-relaxed text-lg" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />,
                li: ({ node, ...props }) => <li className="text-gray-700 text-lg pl-2" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-bold text-gray-900 bg-yellow-50 px-1 rounded" {...props} />,
                code: ({ node, ...props }) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-primary-600 border border-gray-200" {...props} />,
              }}
            >
              {getDisplayContent()}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Quick Links Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-6"><TranslatedText language={selectedLanguage}>Quick Links</TranslatedText></h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a
            href="/browse"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-1"><TranslatedText language={selectedLanguage}>Browse Listings</TranslatedText></h3>
            <p className="text-sm opacity-90"><TranslatedText language={selectedLanguage}>Explore available products</TranslatedText></p>
          </a>

          <a
            href="/price-info"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-1"><TranslatedText language={selectedLanguage}>Price Information</TranslatedText></h3>
            <p className="text-sm opacity-90"><TranslatedText language={selectedLanguage}>Check current market prices</TranslatedText></p>
          </a>

          <a
            href="/create-listing"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-1"><TranslatedText language={selectedLanguage}>Create Listing</TranslatedText></h3>
            <p className="text-sm opacity-90"><TranslatedText language={selectedLanguage}>List your products</TranslatedText></p>
          </a>

          <a
            href="/negotiations"
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors"
          >
            <h3 className="font-bold mb-1"><TranslatedText language={selectedLanguage}>My Negotiations</TranslatedText></h3>
            <p className="text-sm opacity-90"><TranslatedText language={selectedLanguage}>View your offers and deals</TranslatedText></p>
          </a>
        </div>
      </div>
    </div>
  );
}
