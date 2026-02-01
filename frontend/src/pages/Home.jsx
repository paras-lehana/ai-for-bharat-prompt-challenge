import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { listingsAPI, authAPI } from '../utils/api';
import { FiMic, FiSearch, FiTrendingUp, FiUsers, FiShield, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import KisaanBot from '../components/KisaanBot';
import { getCropImageUrl, getTranslatedCropName } from '../utils/cropImageMapper';
import WeatherWidget from '../components/WeatherWidget';
import MarketAdvisory from '../components/MarketAdvisory';
import TranslatedText from '../components/TranslatedText';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Hindi translations for common UI texts (hardcoded for instant display fallback)
const HINDI_TRANSLATIONS = {
  'Welcome': 'स्वागत है',
  'Farmer': 'किसान',
  'Trade in Your Language. Negotiate Fairly. Earn More.': 'अपनी भाषा में व्यापार करें। उचित मोलभाव करें। अधिक कमाएं।',
  'Voice Queries': 'वॉयस क्वेरी',
  'Ask prices in your language. No reading required.': 'अपनी भाषा में कीमत पूछें। पढ़ने की जरूरत नहीं।',
  'Fair Pricing': 'उचित मूल्य',
  'Transparent quality-based pricing formula.': 'पारदर्शी गुणवत्ता-आधारित मूल्य निर्धारण।',
  'Find Peers': 'साथियों को खोजें',
  'Discover vendors nearby. Collaborate on bulk orders.': 'पास के विक्रेताओं को खोजें। थोक ऑर्डर पर सहयोग करें।',
  'Trust System': 'ट्रस्ट सिस्टम',
  'Transparent ratings and AI dispute resolution.': 'पारदर्शी रेटिंग और AI विवाद समाधान।',
  'eNAM Integration': 'eNAM एकीकरण',
  'Live prices from government platforms.': 'सरकारी प्लेटफॉर्म से लाइव कीमतें।',
  'Smart Search': 'स्मार्ट खोज',
  'Find products by quality, location, price.': 'गुणवत्ता, स्थान, कीमत से उत्पाद खोजें।',
  'Why Choose Lokal Mandi?': 'लोकल मंडी क्यों चुनें?',
  'Powered by Cutting-Edge AI': 'अत्याधुनिक AI द्वारा संचालित',
  'We integrate India\'s best AI platforms to bring you the most advanced agricultural trading experience': 'हम भारत के सर्वश्रेष्ठ AI प्लेटफॉर्म के साथ मिलकर सबसे उन्नत कृषि व्यापार अनुभव प्रदान करते हैं',
  'BHASHINI Integration': 'भाषिणी एकीकरण',
  'India\'s national language AI platform': 'भारत का राष्ट्रीय भाषा AI प्लेटफॉर्म',
  'Voice & translation in 22 Indian languages': '22 भारतीय भाषाओं में वॉयस और अनुवाद',
  'Advanced speech-to-text engine': 'उन्नत स्पीच-टू-टेक्स्ट इंजन',
  '95%+ accuracy in all Indian languages': 'सभी भारतीय भाषाओं में 95%+ सटीकता',
  'Smart listing & negotiation AI': 'स्मार्ट लिस्टिंग और बातचीत AI',
  'Active Listings': 'सक्रिय लिस्टिंग',
  'Vendors': 'विक्रेता',
  'Traded': 'व्यापार हुआ',
  'Languages': 'भाषाएं',
  'Featured Listings': 'प्रमुख लिस्टिंग',
  'View All': 'सभी देखें',
  'Ready to Start Trading?': 'व्यापार शुरू करने के लिए तैयार?',
  'Join thousands of farmers trading in their local language': 'हजारों किसानों के साथ अपनी स्थानीय भाषा में व्यापार करें',
  'Browse Listings': 'लिस्टिंग देखें',
  'List Your Product': 'अपना उत्पाद लिस्ट करें',
  'New to Lokal Mandi?': 'लोकल मंडी पर नए हैं?',
  'Check out our comprehensive guides and tutorials': 'हमारी विस्तृत गाइड और ट्यूटोरियल देखें',
  'View Help & Guides': 'सहायता और गाइड देखें',
  'Complete Feature List': 'पूर्ण फीचर सूची',
  'Expand Full Feature List': 'पूर्ण फीचर सूची विस्तार करें',
  'Hide': 'छुपाएं',
  'Kisaan Bot': 'किसान बॉट'
};

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const { t: i18nT, i18n } = useTranslation();
  const [featuredListings, setFeaturedListings] = useState([]);
  const [showKisaanBot, setShowKisaanBot] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');

  useEffect(() => {
    loadFeaturedListings();
    setCurrentLanguage(i18n.language);
  }, [i18n.language]);

  // Combined translation helper
  const t = (text) => {
    if (i18n.language === 'en') return text;
    // 1. Check hardcoded Hindi first for speed
    if (i18n.language === 'hi' && HINDI_TRANSLATIONS[text]) {
      return HINDI_TRANSLATIONS[text];
    }
    // 2. Fallback to i18next
    return i18nT(text);
  };

  const handleLanguageChange = async (newLang) => {
    i18n.changeLanguage(newLang);
    setCurrentLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);

    // Update user profile if logged in
    try {
      if (user) {
        await authAPI.updateProfile({ languagePreference: newLang });
        setUser({ ...user, languagePreference: newLang });
      }
    } catch (error) {
      console.error('Error updating language preference:', error);
    }
  };

  const loadFeaturedListings = async () => {
    try {
      const response = await listingsAPI.search({ limit: 4 });
      setFeaturedListings(response.data.listings || []);
    } catch (error) {
      console.error('Error loading listings:', error);
    }
  };

  const allFeatures = [
    { title: 'Voice-Based Price Discovery', desc: 'Ask prices in 22 Indian languages using SARVAM AI', icon: '🎤', status: '✅' },
    { title: 'AI Negotiation Copilot', desc: 'Smart counter-offers powered by OpenRouter AI', icon: '🤖', status: '✅' },
    { title: 'Dynamic Quality Pricing', desc: 'Transparent quality-based pricing formula', icon: '💰', status: '✅' },
    { title: 'Peer Vendor Discovery', desc: 'Find nearby vendors for bulk orders', icon: '👥', status: '✅' },
    { title: 'Smart Trust System', desc: 'AI-powered ratings and dispute resolution', icon: '🛡️', status: '✅' },
    { title: 'eNAM Integration', desc: 'Live government market prices', icon: '🏛️', status: '✅' },
    { title: 'Multilingual Advisory', desc: 'Market insights in your language', icon: '📊', status: '✅' },
    { title: 'Real-time Translation', desc: 'Chat with vendors in any language', icon: '🌐', status: '✅' },
    { title: 'Quality Verification', desc: 'Photo-based quality assessment', icon: '📸', status: '✅' },
    { title: 'Smart Search', desc: 'Find products by quality, location, price', icon: '🔍', status: '✅' }
  ];

  return (
    <div key={currentLanguage} className="container py-8 pb-24 md:pb-8 animate-fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              <TranslatedText text="Welcome" />, {user?.name || <TranslatedText text="Farmer" />}! 🌾
            </h1>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">
              <TranslatedText text="Trade in Your Language. Negotiate Fairly. Earn More." />
            </p>
          </div>

          {/* Language Switcher */}
          <div className="w-full sm:w-auto sm:ml-4">
            <select
              value={currentLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full sm:w-auto bg-white text-gray-800 px-4 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors cursor-pointer shadow-md min-h-[48px]"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="bn">বাংলা (Bengali)</option>
            </select>
          </div>
        </div>

        {/* Voice Query Button */}
        <button
          onClick={() => setShowKisaanBot(true)}
          className="w-full sm:w-auto bg-white text-primary-600 px-6 sm:px-8 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 min-h-[56px] shadow-lg"
        >
          <FiMic className="w-6 h-6" />
          <span>🤖 <TranslatedText text="Kisaan Bot" /></span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <WeatherWidget location={user?.location || "Pune"} />
        </div>
        <div className="lg:col-span-2">
          <MarketAdvisory location={user?.locationState || "Punjab"} />
        </div>
      </div>

      {showKisaanBot && <KisaanBot onClose={() => setShowKisaanBot(false)} />}

      {/* AI Showcase */}
      <section className="py-12 bg-white rounded-2xl mb-8 px-6 shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          <TranslatedText text="Powered by Cutting-Edge AI" /> 🚀
        </h2>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="text-5xl mb-4">🎤</div>
            <h3 className="text-xl font-bold mb-2"><TranslatedText text="BHASHINI Integration" /></h3>
            <p className="text-sm text-gray-600"><TranslatedText text="India's national language AI platform" /></p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-bold mb-2"><TranslatedText text="SARVAM AI" /></h3>
            <p className="text-sm text-gray-600"><TranslatedText text="95%+ accuracy in all Indian languages" /></p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-xl font-bold mb-2"><TranslatedText text="OpenRouter AI" /></h3>
            <p className="text-sm text-gray-600"><TranslatedText text="Smart listing & negotiation AI" /></p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800"><TranslatedText text="Featured Listings" /></h2>
          <Link to="/browse" className="text-primary-600 font-bold hover:underline">
            <TranslatedText text="View All" /> →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredListings.map((listing) => {
            const imageUrl = getCropImageUrl(listing.cropType);
            return (
              <Link key={listing.id} to={`/listing/${listing.id}`} className="card group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img src={imageUrl} alt={listing.cropType} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="font-bold text-gray-800">{getTranslatedCropName(listing.cropType, i18n.language)}</h3>
                <p className="text-primary-600 font-bold">₹{Math.round(listing.finalPrice)}/<TranslatedText text={listing.unit} /></p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
          <div className="text-3xl font-bold text-primary-600">1,000+</div>
          <p className="text-gray-500 text-sm mt-1"><TranslatedText text="Active Listings" /></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
          <div className="text-3xl font-bold text-primary-600">500+</div>
          <p className="text-gray-500 text-sm mt-1"><TranslatedText text="Vendors" /></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
          <div className="text-3xl font-bold text-primary-600">₹50L</div>
          <p className="text-gray-500 text-sm mt-1"><TranslatedText text="Traded" /></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-100">
          <div className="text-3xl font-bold text-primary-600">22</div>
          <p className="text-gray-500 text-sm mt-1"><TranslatedText text="Languages" /></p>
        </div>
      </div>

      {/* Guide Link */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white text-center shadow-lg">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-2xl font-bold mb-2"><TranslatedText text="New to Lokal Mandi?" /></h2>
        <p className="mb-6 opacity-90"><TranslatedText text="Check out our comprehensive guides and tutorials" /></p>
        <Link to="/guide" className="inline-block bg-white text-teal-600 px-10 py-3 rounded-full font-bold hover:shadow-xl transition-all">
          <TranslatedText text="View Help & Guides" />
        </Link>
      </div>
    </div>
  );
}
