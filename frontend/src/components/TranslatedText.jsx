/**
 * TranslatedText Component
 * Automatically translates text when language changes
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const translationCache = new Map();

// Hardcoded Hindi translations for common UI elements (instant, no API call)
const HINDI_UI_TRANSLATIONS = {
  'Messages': 'संदेश',
  'Conversations': 'बातचीत',
  'No conversations yet': 'अभी तक कोई बातचीत नहीं',
  'Select a conversation to start messaging': 'संदेश भेजना शुरू करने के लिए बातचीत चुनें',
  'Type a message...': 'संदेश लिखें...',
  'Send': 'भेजें',
  'Loading...': 'लोड हो रहा है...',
  'No messages yet': 'अभी तक कोई संदेश नहीं',
  'Back': 'वापस',
  'My Negotiations': 'मेरी बातचीत',
  'No negotiations yet': 'अभी तक कोई बातचीत नहीं',
  'Start making offers on listings': 'लिस्टिंग पर ऑफ़र देना शुरू करें',
  'View Details': 'विवरण देखें',
  'Withdraw': 'वापस लें',
  'Pending': 'लंबित',
  'Accepted': 'स्वीकृत',
  'Rejected': 'अस्वीकृत',
  'Loading': 'लोड हो रहा है',
  'Read': 'पढ़ें',
  'Language': 'भाषा',
  'Help & Documentation': 'सहायता और दस्तावेज़',
  'Back to all guides': 'सभी गाइडों पर वापस जाएं',
  'Quick Start Guide': 'त्वरित प्रारंभ मार्गदर्शिका',
  'Negotiation Tips': 'बातचीत के सुझाव',
  'Trust & Safety': 'विश्वास और सुरक्षा',
  'Technical Support': 'तकनीकी सहायता',
  'Get started in 5 minutes': '5 मिनट में शुरू करें',
  'Get the best deals': 'सर्वोत्तम सौदे प्राप्त करें',
  'Stay safe while trading': 'व्यापार करते समय सुरक्षित रहें',
  'Troubleshooting and help': 'समस्या निवारण और सहायता',
  'Tomato': 'टमाटर',
  'Onion': 'प्याज',
  'Potato': 'आलू',
  'Wheat': 'गेहूं',
  'Rice': 'चावल',
  'Sugarcane': 'गन्ना',
  'Cotton': 'कपास',
  'Maize': 'मक्का',
  'Soybean': 'सोयाबीन',
  'Mustard': 'सरसों',
  'Base Price': 'आधार मूल्य',
  'Final Price': 'अंतिम मूल्य',
  'Quality': 'गुणवत्ता',
  'Quantity': 'मात्रा',
  'Location': 'स्थान',
  'Description': 'विवरण',
  'Vendor': 'विक्रेता',
  'Make an Offer': 'एक ऑफ़र दें',
  'Welcome': 'स्वागत है',
  'Farmer': 'किसान',
  'Trade in Your Language. Negotiate Fairly. Earn More.': 'अपनी भाषा में व्यापार करें। उचित मोलभाव करें। अधिक कमाएं।',
  'Kisaan Bot': 'किसान बॉट',
  'Powered by Cutting-Edge AI': 'अत्याधुनिक AI द्वारा संचालित',
  'BHASHINI Integration': 'भाषिणी एकीकरण',
  "India's national language AI platform": 'भारत का राष्ट्रीय भाषा AI प्लेटफॉर्म',
  'SARVAM AI': 'SARVAM AI',
  '95%+ accuracy in all Indian languages': 'सभी भारतीय भाषाओं में 95%+ सटीकता',
  'OpenRouter AI': 'OpenRouter AI',
  'Smart listing & negotiation AI': 'स्मार्ट लिस्टिंग और बातचीत AI',
  'Featured Listings': 'प्रमुख लिस्टिंग',
  'View All': 'सभी देखें',
  'Active Listings': 'सक्रिय लिस्टिंग',
  'Vendors': 'विक्रेता',
  'Traded': 'व्यापार हुआ',
  'Languages': 'भाषाएं',
  'New to Lokal Mandi?': 'लोकल मंडी पर नए हैं?',
  'Check out our comprehensive guides and tutorials': 'हमारी विस्तृत गाइड और ट्यूटोरियल देखें',
  'View Help & Guides': 'सहायता और गाइड देखें'
};

export default function TranslatedText({ children, text, language: propLanguage, as: Component = 'span' }) {
  const content = children || text || '';
  const [translatedText, setTranslatedText] = useState(content);
  const [loading, setLoading] = useState(false);

  // Get language from props or localStorage
  const language = propLanguage || localStorage.getItem('i18nextLng') || 'en';

  useEffect(() => {
    const translateText = async () => {
      if (!content) return;

      // If English or no language, show original
      if (language === 'en' || !language) {
        setTranslatedText(content);
        return;
      }

      // Check hardcoded Hindi translations first (instant)
      if (language === 'hi' && HINDI_UI_TRANSLATIONS[content]) {
        setTranslatedText(HINDI_UI_TRANSLATIONS[content]);
        return;
      }

      // Check cache
      const cacheKey = `${String(content).substring(0, 100)}-${language}`;
      if (translationCache.has(cacheKey)) {
        setTranslatedText(translationCache.get(cacheKey));
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/voice/translate`, {
          text: content,
          targetLanguage: language
        });

        const translated = response.data.translatedText || content;
        translationCache.set(cacheKey, translated);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(content); // Fallback to original
      } finally {
        setLoading(false);
      }
    };

    translateText();
  }, [content, language]);

  return (
    <Component>
      {loading && language !== 'en' ? `${content}...` : translatedText}
    </Component>
  );
}
