/**
 * FILE: frontend/src/pages/Login.jsx
 * 
 * PURPOSE: Login page with OTP authentication
 */

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FiPhone, FiKey } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Login() {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp' or 'profile'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [role, setRole] = useState('vendor');
  const [languagePreference, setLanguagePreference] = useState('en'); // Default to English
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [translations, setTranslations] = useState({});
  const [translating, setTranslating] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Load saved language preference on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('i18nextLng');
    if (savedLang && savedLang !== languagePreference) {
      setLanguagePreference(savedLang);
    }
  }, []);

  // Translate content when language changes (ONLY if not English)
  useEffect(() => {
    // Save language preference to localStorage immediately
    localStorage.setItem('i18nextLng', languagePreference);

    // CRITICAL: Do NOT translate if English is selected
    if (languagePreference === 'en') {
      setTranslations({}); // Clear any existing translations
      setTranslating(false);
      return; // Exit early - no translation needed
    }

    // Only translate for non-English languages
    translateContent();
  }, [languagePreference]);

  const translateContent = async () => {
    setTranslating(true);
    try {
      const textsToTranslate = [
        'Login with Phone',
        'Phone Number',
        'Send OTP',
        'Enter OTP',
        'I am a',
        'Vendor',
        'Sell products',
        'Buyer',
        'Buy products',
        'Preferred Language',
        'Verify & Login',
        'Change Phone Number',
        'Why Farmers Trust Us',
        'Speak in Your Language',
        'No reading needed. Use voice commands in 22 Indian languages to check prices and list products',
        'Get Fair Prices',
        'Transparent quality-based pricing. See exactly how prices are calculated. No hidden charges',
        'Smart Negotiation',
        'AI assistant helps you negotiate better deals based on real market data',
        'Safe & Trusted',
        'Verified vendors with ratings. Dispute resolution system protects both buyers and sellers',
        'Find Nearby Vendors',
        'Discover farmers in your area. Team up for bulk orders and better prices',
        'Live Market Prices',
        'Real-time government market data. Know the right price before you sell',
        'Trade in Your Language. Negotiate Fairly. Earn More.',
        'Sending...',
        'Verifying...',
        'OTP Code'
      ];

      console.log(`🔄 Translating ${textsToTranslate.length} texts to ${languagePreference}...`);

      // Translate in batches to avoid rate limiting (429 errors)
      const batchSize = 5;
      const translatedTexts = [];

      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        const batch = textsToTranslate.slice(i, i + batchSize);

        const batchResults = await Promise.all(
          batch.map(async (text) => {
            try {
              const response = await axios.post(`${API_BASE_URL}/voice/translate`, {
                text,
                targetLanguage: languagePreference
              });
              const translated = response.data.translatedText || text;

              // Log if we get mock translation (has [HI] prefix)
              if (translated.startsWith('[HI]') || translated.startsWith('[')) {
                console.warn(`⚠️ Got mock translation for "${text}": ${translated}`);
              }

              return translated;
            } catch (err) {
              console.error(`❌ Translation error for "${text}":`, err.response?.status || err.message);
              return text;
            }
          })
        );

        translatedTexts.push(...batchResults);

        // Add small delay between batches to avoid rate limiting
        if (i + batchSize < textsToTranslate.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      const translationMap = {};
      textsToTranslate.forEach((text, index) => {
        translationMap[text] = translatedTexts[index];
      });

      console.log('✅ Translation complete. Sample:', translationMap['Login with Phone']);
      setTranslations(translationMap);
    } catch (error) {
      console.error('❌ Translation error:', error);
    } finally {
      setTranslating(false);
    }
  };

  const t = (text) => {
    if (languagePreference === 'en') return text;
    return translations[text] || text;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.sendOTP(phoneNumber);
      setOtpSent(true);
      setStep('otp');

      // Always show alert that OTP was sent
      if (response.data.otp) {
        // Development mode - show actual OTP
        alert(`✅ OTP Sent!\n\nDevelopment OTP: ${response.data.otp}\n\nOr use bypass code: 1104`);
      } else {
        // Production mode - just confirm sent
        alert(`✅ OTP Sent!\n\nPlease check your phone for the OTP code.\n\nDevelopment bypass: Use 1104`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(phoneNumber, otp, {
        role,
        languagePreference
      });

      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-2">🌾 Lokal Mandi</h1>
          <p className="text-sm sm:text-base text-gray-600">{t('Trade in Your Language. Negotiate Fairly. Earn More.')}</p>
          <div className="mt-4">
            <a
              href="/demo"
              className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold hover:bg-blue-200 transition-colors"
            >
              <span>🎥</span>
              <span>Watch Product Demo</span>
            </a>
          </div>
        </div>

        {/* Login Card */}
        <div className="card p-4 sm:p-6">
          {/* Language Selector at top */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('Preferred Language')}
            </label>
            <select
              value={languagePreference}
              onChange={(e) => setLanguagePreference(e.target.value)}
              className="input-field"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
            {translating && <p className="text-xs text-blue-600 mt-1">🔄 Translating...</p>}
          </div>

          {step === 'phone' && (
            <form onSubmit={handleSendOTP}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('Login with Phone')}</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('Phone Number')}
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    inputMode="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+919876543210"
                    className="input-field pl-10"
                    autoComplete="tel"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +91XXXXXXXXXX</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base sm:text-lg"
              >
                {loading ? 'Sending...' : t('Send OTP')}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t('Enter OTP')}</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('OTP Code')}
                </label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="Enter OTP or 1104"
                    className="input-field pl-10 text-center text-xl sm:text-2xl tracking-widest"
                    autoComplete="one-time-code"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter OTP sent to {phoneNumber} (or use 1104 for testing)</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('I am a')}
                </label>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`p-3 sm:p-4 border-2 rounded-lg min-h-[80px] transition-all ${role === 'vendor'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                      }`}
                  >
                    <div className="text-2xl mb-2">🌾</div>
                    <div className="font-medium text-sm sm:text-base">{t('Vendor')}</div>
                    <div className="text-xs text-gray-500">{t('Sell products')}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-3 sm:p-4 border-2 rounded-lg min-h-[80px] transition-all ${role === 'buyer'
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300 hover:border-primary-300'
                      }`}
                  >
                    <div className="text-2xl mb-2">🛒</div>
                    <div className="font-medium text-sm sm:text-base">{t('Buyer')}</div>
                    <div className="text-xs text-gray-500">{t('Buy products')}</div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-base sm:text-lg"
              >
                {loading ? 'Verifying...' : t('Verify & Login')}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="btn-secondary w-full mt-3"
              >
                {t('Change Phone Number')}
              </button>
            </form>
          )}
        </div>

        {/* Features */}
        <div className="mt-6 sm:mt-8 space-y-4">
          <h3 className="text-center font-bold text-gray-700 text-lg sm:text-xl mb-4 sm:mb-6">{t('Why Farmers Trust Us')}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🎤</div>
              <div className="font-bold text-lg mb-2">{t('Speak in Your Language')}</div>
              <div className="text-sm text-gray-700">{t('No reading needed. Use voice commands in 22 Indian languages to check prices and list products')}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">💰</div>
              <div className="font-bold text-lg mb-2">{t('Get Fair Prices')}</div>
              <div className="text-sm text-gray-700">{t('Transparent quality-based pricing. See exactly how prices are calculated. No hidden charges')}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🤝</div>
              <div className="font-bold text-lg mb-2">{t('Smart Negotiation')}</div>
              <div className="text-sm text-gray-700">{t('AI assistant helps you negotiate better deals based on real market data')}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">🛡️</div>
              <div className="font-bold text-lg mb-2">{t('Safe & Trusted')}</div>
              <div className="text-sm text-gray-700">{t('Verified vendors with ratings. Dispute resolution system protects both buyers and sellers')}</div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">👥</div>
              <div className="font-bold text-lg mb-2">{t('Find Nearby Vendors')}</div>
              <div className="text-sm text-gray-700">{t('Discover farmers in your area. Team up for bulk orders and better prices')}</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-3">📊</div>
              <div className="font-bold text-lg mb-2">{t('Live Market Prices')}</div>
              <div className="text-sm text-gray-700">{t('Real-time government market data. Know the right price before you sell')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
