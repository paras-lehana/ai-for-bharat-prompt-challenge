import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { listingsAPI, authAPI } from '../utils/api';
import { FiMic, FiSearch, FiTrendingUp, FiUsers, FiShield, FiGlobe, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import KisaanBot from '../components/KisaanBot';
import { getCropImageUrl } from '../utils/cropImageMapper';
import WeatherWidget from '../components/WeatherWidget';

export default function Home() {
  const { user, setUser } = useContext(AuthContext);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [showKisaanBot, setShowKisaanBot] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [languagePreference, setLanguagePreference] = useState(user?.languagePreference || 'en');

  useEffect(() => {
    loadFeaturedListings();
    if (user?.languagePreference) {
      setLanguagePreference(user.languagePreference);
    }
  }, [user]);

  const handleLanguageChange = async (newLang) => {
    setLanguagePreference(newLang);

    // Update user profile
    try {
      await authAPI.updateProfile({ languagePreference: newLang });
      // Update user context
      if (user) {
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
    { title: 'Smart Search', desc: 'Find products by quality, location, price', icon: '🔍', status: '✅' },
    { title: 'Price Alerts', desc: 'Get notified when prices change', icon: '🔔', status: '✅' },
    { title: 'Transaction History', desc: 'Track all your deals', icon: '📜', status: '✅' },
    { title: 'Vendor Profiles', desc: 'Detailed vendor information and ratings', icon: '👤', status: '✅' },
    { title: 'Negotiation Dashboard', desc: 'Manage all negotiations in one place', icon: '💼', status: '✅' },
    { title: 'Market Analytics', desc: 'Insights on trends and opportunities', icon: '📈', status: '✅' },
    { title: 'Dispute Resolution', desc: 'Fair AI-mediated conflict resolution', icon: '⚖️', status: '✅' },
    { title: 'Bulk Order Matching', desc: 'Connect with peers for better prices', icon: '📦', status: '✅' },
    { title: 'Mobile Responsive', desc: 'Works perfectly on all devices', icon: '📱', status: '✅' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-6 sm:mb-8 animate-slide-down shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
          <div className="flex-1 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Welcome, {user?.name || 'Farmer'}! 🌾
            </h1>
            <p className="text-base sm:text-lg mb-4 sm:mb-6">
              Trade in Your Language. Negotiate Fairly. Earn More.
            </p>
          </div>

          {/* Language Switcher */}
          <div className="w-full sm:w-auto sm:ml-4">
            <select
              value={languagePreference}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full sm:w-auto bg-white text-gray-800 px-4 py-3 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors cursor-pointer shadow-md min-h-[48px]"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="kn">ಕನ್ನಡ</option>
              <option value="pa">ਪੰਜਾਬੀ</option>
            </select>
          </div>
        </div>

        {/* Voice Query Button */}
        <button
          onClick={() => setShowKisaanBot(true)}
          className="w-full sm:w-auto bg-white text-primary-600 px-6 sm:px-8 py-4 rounded-lg font-bold text-base sm:text-lg hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center space-x-2 min-h-[56px] shadow-lg"
        >
          <FiMic className="w-6 h-6" />
          <span>🤖 Kisaan Bot</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <WeatherWidget location={user?.location || "Pune"} />
        </div>
        <div className="lg:col-span-2 hidden lg:block">
          <div className="bg-white rounded-xl p-6 shadow-md h-full flex flex-col justify-center items-start border-l-4 border-teal-500">
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-2xl">📢</span> Market Advisory
            </h3>
            <p className="text-gray-600">
              Prices for <strong>Wheat</strong> in <strong>Punjab</strong> are likely to increase by 5-10% next week due to high demand. Consider holding stock or negotiating higher rates.
            </p>
          </div>
        </div>
      </div>

      {/* Kisaan Bot Modal */}
      {showKisaanBot && <KisaanBot onClose={() => setShowKisaanBot(false)} />}

      {/* AI Showcase Section */}
      <section className="py-12 bg-white rounded-2xl mb-8 px-6 shadow-lg animate-fade-in">
        <h2 className="text-3xl font-bold text-center mb-4">
          Powered by Cutting-Edge AI 🚀
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We integrate India's best AI platforms to bring you the most advanced agricultural trading experience
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-6xl mb-4 animate-bounce-subtle">🎤</div>
            <h3 className="text-xl font-bold mb-3">BHASHINI Integration</h3>
            <p className="text-gray-700 mb-2">India's national language AI platform</p>
            <p className="text-sm text-gray-600">Voice & translation in 22 Indian languages</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-6xl mb-4 animate-bounce-subtle">🤖</div>
            <h3 className="text-xl font-bold mb-3">SARVAM AI</h3>
            <p className="text-gray-700 mb-2">Advanced speech-to-text engine</p>
            <p className="text-sm text-gray-600">95%+ accuracy in all Indian languages</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
            <div className="text-6xl mb-4 animate-bounce-subtle">✨</div>
            <h3 className="text-xl font-bold mb-3">OpenRouter AI</h3>
            <p className="text-gray-700 mb-2">Smart listing & negotiation AI</p>
            <p className="text-sm text-gray-600">Powered by Qwen3-VL 32B model</p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slide-up">
        <div className="card-interactive text-center p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-primary-600">1,000+</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Active Listings</div>
        </div>
        <div className="card-interactive text-center p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-primary-600">500+</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Vendors</div>
        </div>
        <div className="card-interactive text-center p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-primary-600">₹50L</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Traded</div>
        </div>
        <div className="card-interactive text-center p-4 sm:p-6">
          <div className="text-2xl sm:text-3xl font-bold text-primary-600">22</div>
          <div className="text-xs sm:text-sm text-gray-600 mt-1">Languages</div>
        </div>
      </div>

      {/* Core Features */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">Why Choose Lokal Mandi?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="card-interactive p-4 sm:p-6">
            <FiMic className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Voice Queries</h3>
            <p className="text-gray-600 text-sm">Ask prices in your language. No reading required.</p>
          </div>

          <div className="card-interactive p-4 sm:p-6">
            <FiTrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Fair Pricing</h3>
            <p className="text-gray-600 text-sm">Transparent quality-based pricing formula.</p>
          </div>

          <div className="card-interactive p-4 sm:p-6">
            <FiUsers className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Find Peers</h3>
            <p className="text-gray-600 text-sm">Discover vendors nearby. Collaborate on bulk orders.</p>
          </div>

          <div className="card-interactive p-4 sm:p-6">
            <FiShield className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Trust System</h3>
            <p className="text-gray-600 text-sm">Transparent ratings and AI dispute resolution.</p>
          </div>

          <div className="card-interactive p-4 sm:p-6">
            <FiGlobe className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">eNAM Integration</h3>
            <p className="text-gray-600 text-sm">Live prices from government platforms.</p>
          </div>

          <div className="card-interactive p-4 sm:p-6">
            <FiSearch className="w-10 h-10 sm:w-12 sm:h-12 text-primary-600 mb-3 sm:mb-4" />
            <h3 className="font-bold text-base sm:text-lg mb-2">Smart Search</h3>
            <p className="text-gray-600 text-sm">Find products by quality, location, price.</p>
          </div>
        </div>
      </div>

      {/* Expandable Feature List */}
      <section className="py-8 bg-gray-50 rounded-2xl mb-8 px-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Complete Feature List
        </h2>

        <button
          onClick={() => setShowAllFeatures(!showAllFeatures)}
          className="mx-auto flex items-center space-x-2 bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors mb-6"
        >
          <span>{showAllFeatures ? 'Hide' : 'Expand'} Full Feature List</span>
          {showAllFeatures ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {showAllFeatures && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {allFeatures.map((feature, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-sm">{feature.title}</h3>
                      <span className="text-xs">{feature.status}</span>
                    </div>
                    <p className="text-xs text-gray-600">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Listings */}
      <div className="mb-6 sm:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">Featured Listings</h2>
          <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium text-sm sm:text-base min-h-[44px] flex items-center">
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {featuredListings.map((listing) => {
            // Handle images - could be array or JSON string
            let images = [];
            if (listing.images) {
              if (Array.isArray(listing.images)) {
                images = listing.images;
              } else if (typeof listing.images === 'string') {
                try {
                  images = JSON.parse(listing.images);
                } catch (e) {
                  images = [];
                }
              }
            }
            const imageUrl = images[0] || getCropImageUrl(listing.cropType);

            return (
              <Link key={listing.id} to={`/listing/${listing.id}`} className="card-interactive">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={listing.cropType}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/crops/wheat.jpg';
                    }}
                  />
                </div>
                <h3 className="font-bold text-lg mb-2">{listing.cropType}</h3>
                <div className="mb-2">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-primary-600">₹{listing.finalPrice}</span>
                    <span className="text-sm text-gray-600">/{listing.unit}</span>
                  </div>
                  {listing.basePrice !== listing.finalPrice && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500 line-through">₹{listing.basePrice}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                        {Math.round(((listing.finalPrice - listing.basePrice) / listing.basePrice) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded">
                    {listing.qualityTier}
                  </span>
                  <span>{listing.quantity} {listing.unit}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary-50 rounded-2xl p-8 text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of farmers trading in their local language
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/browse" className="btn-primary">
            Browse Listings
          </Link>
          {user?.role === 'vendor' && (
            <Link to="/create-listing" className="btn-secondary">
              List Your Product
            </Link>
          )}
        </div>
      </div>

      {/* Guide CTA */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-8 text-white text-center">
        <div className="text-5xl mb-4">📚</div>
        <h2 className="text-2xl font-bold mb-4">New to Lokal Mandi?</h2>
        <p className="mb-6 text-lg">
          Check out our comprehensive guides and tutorials
        </p>
        <Link to="/guide" className="inline-block bg-white text-teal-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
          View Help & Guides
        </Link>
      </div>
    </div>
  );
}
