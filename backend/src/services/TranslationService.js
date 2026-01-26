/**
 * FILE: backend/src/services/TranslationService.js
 * 
 * PURPOSE: Translation service for multilingual support
 * Uses BHASHINI API (mocked for MVP)
 */

class TranslationService {
  /**
   * Supported languages
   */
  static SUPPORTED_LANGUAGES = {
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    pa: 'Punjabi',
    en: 'English'
  };

  /**
   * Mock translations for common phrases
   */
  static TRANSLATIONS = {
    // Greetings
    'welcome': {
      hi: 'स्वागत है',
      mr: 'स्वागत आहे',
      ta: 'வரவேற்கிறோம்',
      te: 'స్వాగతం',
      kn: 'ಸ್ವಾಗತ',
      pa: 'ਸੁਆਗਤ ਹੈ',
      en: 'Welcome'
    },
    'hello': {
      hi: 'नमस्ते',
      mr: 'नमस्कार',
      ta: 'வணக்கம்',
      te: 'నమస్కారం',
      kn: 'ನಮಸ್ಕಾರ',
      pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ',
      en: 'Hello'
    },
    // Market terms
    'price': {
      hi: 'मूल्य',
      mr: 'किंमत',
      ta: 'விலை',
      te: 'ధర',
      kn: 'ಬೆಲೆ',
      pa: 'ਕੀਮਤ',
      en: 'Price'
    },
    'quality': {
      hi: 'गुणवत्ता',
      mr: 'गुणवत्ता',
      ta: 'தரம்',
      te: 'నాణ్యత',
      kn: 'ಗುಣಮಟ್ಟ',
      pa: 'ਗੁਣਵੱਤਾ',
      en: 'Quality'
    },
    'quantity': {
      hi: 'मात्रा',
      mr: 'प्रमाण',
      ta: 'அளவு',
      te: 'పరిమాణం',
      kn: 'ಪ್ರಮಾಣ',
      pa: 'ਮਾਤਰਾ',
      en: 'Quantity'
    },
    // Actions
    'buy': {
      hi: 'खरीदें',
      mr: 'खरेदी करा',
      ta: 'வாங்கு',
      te: 'కొనండి',
      kn: 'ಖರೀದಿಸಿ',
      pa: 'ਖਰੀਦੋ',
      en: 'Buy'
    },
    'sell': {
      hi: 'बेचें',
      mr: 'विक्री करा',
      ta: 'விற்க',
      te: 'అమ్మండి',
      kn: 'ಮಾರಾಟ',
      pa: 'ਵੇਚੋ',
      en: 'Sell'
    },
    'negotiate': {
      hi: 'बातचीत करें',
      mr: 'वाटाघाटी करा',
      ta: 'பேச்சுவார்த்தை',
      te: 'చర్చించండి',
      kn: 'ಮಾತುಕತೆ',
      pa: 'ਗੱਲਬਾਤ ਕਰੋ',
      en: 'Negotiate'
    },
    // Status messages
    'offer_accepted': {
      hi: 'प्रस्ताव स्वीकार किया गया',
      mr: 'ऑफर स्वीकारली',
      ta: 'சலுகை ஏற்றுக்கொள்ளப்பட்டது',
      te: 'ఆఫర్ అంగీకరించబడింది',
      kn: 'ಆಫರ್ ಸ್ವೀಕರಿಸಲಾಗಿದೆ',
      pa: 'ਪੇਸ਼ਕਸ਼ ਸਵੀਕਾਰ ਕੀਤੀ',
      en: 'Offer Accepted'
    },
    'transaction_complete': {
      hi: 'लेनदेन पूर्ण',
      mr: 'व्यवहार पूर्ण',
      ta: 'பரிவர்த்தனை முடிந்தது',
      te: 'లావాదేవీ పూర్తయింది',
      kn: 'ವಹಿವಾಟು ಪೂರ್ಣಗೊಂಡಿದೆ',
      pa: 'ਲੈਣ-ਦੇਣ ਪੂਰਾ',
      en: 'Transaction Complete'
    }
  };

  /**
   * Translate text to target language
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code
   * @param {string} sourceLang - Source language code (default: 'en')
   * @returns {Promise<string>} Translated text
   */
  static async translate(text, targetLang, sourceLang = 'en') {
    try {
      // Check if it's a known phrase
      const lowerText = text.toLowerCase();
      if (this.TRANSLATIONS[lowerText]) {
        return this.TRANSLATIONS[lowerText][targetLang] || text;
      }

      // In production, call BHASHINI API
      if (process.env.BHASHINI_API_KEY && process.env.BHASHINI_API_KEY !== 'your-bhashini-api-key') {
        return await this.callBhashiniAPI(text, targetLang, sourceLang);
      }

      // Mock translation for MVP
      return this.mockTranslate(text, targetLang);
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  /**
   * Mock translation (for MVP without BHASHINI API)
   */
  static mockTranslate(text, targetLang) {
    // Simple mock: add language prefix
    const langNames = {
      hi: '[HI]',
      mr: '[MR]',
      ta: '[TA]',
      te: '[TE]',
      kn: '[KN]',
      pa: '[PA]',
      en: ''
    };

    return `${langNames[targetLang] || ''}${text}`;
  }

  /**
   * Call BHASHINI API for translation
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language
   * @param {string} sourceLang - Source language
   * @returns {Promise<string>} Translated text
   */
  static async callBhashiniAPI(text, targetLang, sourceLang) {
    // TODO: Implement actual BHASHINI API call
    // const response = await axios.post(process.env.BHASHINI_API_URL + '/translate', {
    //   text,
    //   source_language: sourceLang,
    //   target_language: targetLang
    // }, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.BHASHINI_API_KEY}`
    //   }
    // });
    // return response.data.translated_text;

    return this.mockTranslate(text, targetLang);
  }

  /**
   * Translate message for chat
   * @param {string} message - Message text
   * @param {string} senderLang - Sender's language
   * @param {string} recipientLang - Recipient's language
   * @returns {Promise<Object>} Original and translated message
   */
  static async translateMessage(message, senderLang, recipientLang) {
    if (senderLang === recipientLang) {
      return {
        original: message,
        translated: message,
        needsTranslation: false
      };
    }

    const translated = await this.translate(message, recipientLang, senderLang);

    return {
      original: message,
      translated,
      needsTranslation: true,
      sourceLang: senderLang,
      targetLang: recipientLang
    };
  }

  /**
   * Get localized notification message
   * @param {string} notificationType - Type of notification
   * @param {string} lang - Target language
   * @param {Object} data - Data for template
   * @returns {string} Localized message
   */
  static getNotificationMessage(notificationType, lang, data = {}) {
    const templates = {
      new_offer: {
        hi: `नया प्रस्ताव: ₹${data.amount} प्रति ${data.unit}`,
        mr: `नवीन ऑफर: ₹${data.amount} प्रति ${data.unit}`,
        ta: `புதிய சலுகை: ₹${data.amount} ஒன்றுக்கு ${data.unit}`,
        te: `కొత్త ఆఫర్: ₹${data.amount} ${data.unit}కు`,
        kn: `ಹೊಸ ಆಫರ್: ₹${data.amount} ಪ್ರತಿ ${data.unit}`,
        pa: `ਨਵੀਂ ਪੇਸ਼ਕਸ਼: ₹${data.amount} ਪ੍ਰਤੀ ${data.unit}`,
        en: `New Offer: ₹${data.amount} per ${data.unit}`
      },
      price_alert: {
        hi: `${data.crop} की कीमत बढ़ रही है! अभी बेचें।`,
        mr: `${data.crop} ची किंमत वाढत आहे! आता विक्री करा।`,
        ta: `${data.crop} விலை உயர்கிறது! இப்போது விற்கவும்.`,
        te: `${data.crop} ధర పెరుగుతోంది! ఇప్పుడు అమ్మండి.`,
        kn: `${data.crop} ಬೆಲೆ ಹೆಚ್ಚುತ್ತಿದೆ! ಈಗ ಮಾರಾಟ ಮಾಡಿ.`,
        pa: `${data.crop} ਦੀ ਕੀਮਤ ਵਧ ਰਹੀ ਹੈ! ਹੁਣ ਵੇਚੋ.`,
        en: `${data.crop} price is rising! Sell now.`
      },
      transaction_confirmed: {
        hi: `लेनदेन पुष्टि: ₹${data.amount}`,
        mr: `व्यवहार पुष्टी: ₹${data.amount}`,
        ta: `பரிவர்த்தனை உறுதி: ₹${data.amount}`,
        te: `లావాదేవీ నిర్ధారణ: ₹${data.amount}`,
        kn: `ವಹಿವಾಟು ದೃಢೀಕರಣ: ₹${data.amount}`,
        pa: `ਲੈਣ-ਦੇਣ ਪੁਸ਼ਟੀ: ₹${data.amount}`,
        en: `Transaction Confirmed: ₹${data.amount}`
      }
    };

    const template = templates[notificationType];
    if (!template) return notificationType;

    return template[lang] || template.en;
  }

  /**
   * Get supported languages list
   * @returns {Array} List of supported languages
   */
  static getSupportedLanguages() {
    return Object.entries(this.SUPPORTED_LANGUAGES).map(([code, name]) => ({
      code,
      name,
      nativeName: this.TRANSLATIONS.hello[code] || name
    }));
  }
}

module.exports = TranslationService;
