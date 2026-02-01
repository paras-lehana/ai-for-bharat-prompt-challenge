/**
 * FILE: backend/src/services/TranslationService.js
 * 
 * PURPOSE: Translation service for multilingual support
 * Uses BHASHINI API (mocked for MVP)
 */

class TranslationService {
  /**
   * Supported languages (22 Indian languages + English)
   */
  static SUPPORTED_LANGUAGES = {
    hi: 'Hindi',
    mr: 'Marathi',
    ta: 'Tamil',
    te: 'Telugu',
    kn: 'Kannada',
    pa: 'Punjabi',
    gu: 'Gujarati',
    ml: 'Malayalam',
    or: 'Odia',
    bn: 'Bengali',
    as: 'Assamese',
    bho: 'Bhojpuri',
    mai: 'Maithili',
    sat: 'Santali',
    ks: 'Kashmiri',
    ne: 'Nepali',
    kok: 'Konkani',
    sd: 'Sindhi',
    doi: 'Dogri',
    mni: 'Manipuri',
    brx: 'Bodo',
    sa: 'Sanskrit',
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
   * Common UI translations dictionary (for instant, accurate translations)
   */
  static UI_TRANSLATIONS = {
    'Login with Phone': { hi: 'फ़ोन से लॉगिन करें', mr: 'फोनसह लॉगिन करा', ta: 'தொலைபேசி மூலம் உள்நுழைக', te: 'ఫోన్‌తో లాగిన్ చేయండి', kn: 'ಫೋನ್ ಮೂಲಕ ಲಾಗಿನ್ ಮಾಡಿ', pa: 'ਫ਼ੋਨ ਨਾਲ ਲਾਗਇਨ ਕਰੋ' },
    'Phone Number': { hi: 'फ़ोन नंबर', mr: 'फोन नंबर', ta: 'தொலைபேசி எண்', te: 'ఫోన్ నంబర్', kn: 'ಫೋನ್ ಸಂಖ್ಯೆ', pa: 'ਫ਼ੋਨ ਨੰਬਰ' },
    'Send OTP': { hi: 'ओटीपी भेजें', mr: 'ओटीपी पाठवा', ta: 'OTP அனுப்பு', te: 'OTP పంపండి', kn: 'OTP ಕಳುಹಿಸಿ', pa: 'OTP ਭੇਜੋ' },
    'Enter OTP': { hi: 'ओटीपी दर्ज करें', mr: 'ओटीपी प्रविष्ट करा', ta: 'OTP உள்ளிடவும்', te: 'OTP నమోదు చేయండి', kn: 'OTP ನಮೂದಿಸಿ', pa: 'OTP ਦਾਖਲ ਕਰੋ' },
    'Vendor': { hi: 'विक्रेता', mr: 'विक्रेता', ta: 'விற்பனையாளர்', te: 'విక్రేత', kn: 'ಮಾರಾಟಗಾರ', pa: 'ਵਿਕਰੇਤਾ' },
    'Buyer': { hi: 'खरीदार', mr: 'खरेदीदार', ta: 'வாங்குபவர்', te: 'కొనుగోలుదారు', kn: 'ಖರೀದಿದಾರ', pa: 'ਖਰੀਦਦਾਰ' },
    'Sell products': { hi: 'उत्पाद बेचें', mr: 'उत्पादने विका', ta: 'தயாரிப்புகளை விற்கவும்', te: 'ఉత్పత్తులను అమ్మండి', kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಮಾರಾಟ ಮಾಡಿ', pa: 'ਉਤਪਾਦ ਵੇਚੋ' },
    'Buy products': { hi: 'उत्पाद खरीदें', mr: 'उत्पादने खरेदी करा', ta: 'தயாரிப்புகளை வாங்கவும்', te: 'ఉత్పత్తులను కొనండి', kn: 'ಉತ್ಪನ್ನಗಳನ್ನು ಖರೀದಿಸಿ', pa: 'ਉਤਪਾਦ ਖਰੀਦੋ' },
    'Preferred Language': { hi: 'पसंदीदा भाषा', mr: 'पसंतीची भाषा', ta: 'விருப்பமான மொழி', te: 'ఇష్టమైన భాష', kn: 'ಆದ್ಯತೆಯ ಭಾಷೆ', pa: 'ਤਰਜੀਹੀ ਭਾਸ਼ਾ' },
    'Verify & Login': { hi: 'सत्यापित करें और लॉगिन करें', mr: 'सत्यापित करा आणि लॉगिन करा', ta: 'சரிபார்த்து உள்நுழைக', te: 'ధృవీకరించండి మరియు లాగిన్ చేయండి', kn: 'ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಲಾಗಿನ್ ಮಾಡಿ', pa: 'ਤਸਦੀਕ ਕਰੋ ਅਤੇ ਲਾਗਇਨ ਕਰੋ' },
    'Change Phone Number': { hi: 'फ़ोन नंबर बदलें', mr: 'फोन नंबर बदला', ta: 'தொலைபேசி எண்ணை மாற்றவும்', te: 'ఫోన్ నంబర్ మార్చండి', kn: 'ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ಬದಲಾಯಿಸಿ', pa: 'ਫ਼ੋਨ ਨੰਬਰ ਬਦਲੋ' },
    'I am a': { hi: 'मैं हूँ', mr: 'मी आहे', ta: 'நான்', te: 'నేను', kn: 'ನಾನು', pa: 'ਮੈਂ ਹਾਂ' }
  };

  /**
   * Translate text to target language using free translation API
   * @param {string} text - Text to translate
   * @param {string} sourceLang - Source language code (default: 'en')
   * @param {string} targetLang - Target language code
   * @returns {Promise<string>} Translated text
   */
  static async translateText(text, sourceLang = 'en', targetLang) {
    try {
      // If source and target are same, return original
      if (sourceLang === targetLang) {
        return text;
      }

      // Check UI translations dictionary first (instant, accurate)
      if (this.UI_TRANSLATIONS[text] && this.UI_TRANSLATIONS[text][targetLang]) {
        return this.UI_TRANSLATIONS[text][targetLang];
      }

      const axios = require('axios');
      
      // Use Google Translate unofficial API (free, fast, accurate)
      try {
        const googleResponse = await axios.post('https://translate.googleapis.com/translate_a/single', 
          `client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
          { 
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            timeout: 10000 
          }
        );

        if (googleResponse.data && googleResponse.data[0]) {
          // Join all segments for larger text, filtering only valid translated strings
          return googleResponse.data[0]
            .map(segment => (segment && Array.isArray(segment) ? segment[0] : null))
            .filter(text => typeof text === 'string' && text.length > 0)
            .join('');
        }
      } catch (googleError) {
        console.error('Google Translate API error:', googleError.message);
      }

      // Fallback: Try MyMemory Translation API
      try {
        const response = await axios.get('https://api.mymemory.translated.net/get', {
          params: {
            q: text,
            langpair: `${sourceLang}|${targetLang}`
          },
          timeout: 5000
        });

        if (response.data && response.data.responseData && response.data.responseData.translatedText) {
          const translated = response.data.responseData.translatedText;
          
          // Check if translation is valid (not empty or same as input)
          if (translated && translated !== text) {
            return translated;
          }
        }
      } catch (apiError) {
        console.error('MyMemory API error:', apiError.message);
      }

      // If both APIs fail, return mock translation (fallback)
      console.log('All translation APIs failed, returning mock translation');
      return this.mockTranslate(text, targetLang);
      
    } catch (error) {
      console.error('Translation error:', error.message);
      return this.mockTranslate(text, targetLang);
    }
  }

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
   * Transcribe audio using SARVAM AI
   * @param {Buffer|string} audioData - Audio file buffer or base64 string
   * @param {string} language - Language code
   * @returns {Promise<string>} Transcribed text
   */
  static async transcribeAudio(audioData, language = 'hi') {
    try {
      const axios = require('axios');
      const FormData = require('form-data');
      
      // Check if SARVAM API key is configured
      if (!process.env.SARVAM_API_KEY || process.env.SARVAM_API_KEY.includes('your-')) {
        console.log('SARVAM API not configured, using mock transcription');
        return this.mockTranscribe(language);
      }

      // Create form data
      const formData = new FormData();
      
      // Convert base64 to buffer if needed
      let audioBuffer = audioData;
      if (typeof audioData === 'string') {
        // Remove data URL prefix if present
        const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, '');
        audioBuffer = Buffer.from(base64Data, 'base64');
      }
      
      formData.append('file', audioBuffer, {
        filename: 'audio.wav',
        contentType: 'audio/wav'
      });
      
      // Convert language code to SARVAM format (hi -> hi-IN)
      const sarvamLangCode = language.includes('-') ? language : `${language}-IN`;
      formData.append('language_code', sarvamLangCode);
      formData.append('model', 'saaras:v3');

      const response = await axios.post(
        `${process.env.SARVAM_API_URL}/speech-to-text`,
        formData,
        {
          headers: {
            'api-subscription-key': process.env.SARVAM_API_KEY,
            ...formData.getHeaders()
          },
          timeout: 15000
        }
      );

      return response.data.transcript || response.data.text;
    } catch (error) {
      console.error('SARVAM transcription error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
      return this.mockTranscribe(language);
    }
  }

  /**
   * Mock transcription for development
   */
  static mockTranscribe(language) {
    const mockTranscriptions = {
      hi: 'टमाटर का भाव क्या है?',
      mr: 'टोमॅटोची किंमत काय आहे?',
      ta: 'தக்காளி விலை என்ன?',
      te: 'టమాటా ధర ఎంత?',
      kn: 'ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?',
      pa: 'ਟਮਾਟਰ ਦੀ ਕੀਮਤ ਕੀ ਹੈ?',
      gu: 'ટામેટાની કિંમત શું છે?',
      ml: 'തക്കാളിയുടെ വില എന്താണ്?',
      bn: 'টমেটোর দাম কত?',
      en: 'What is the price of tomato?'
    };

    return mockTranscriptions[language] || mockTranscriptions.en;
  }

  /**
   * Synthesize text to speech using SARVAM AI
   * @param {string} text - Text to synthesize
   * @param {string} language - Language code
   * @returns {Promise<string>} Base64 audio
   */
  static async synthesizeSpeech(text, language = 'hi') {
    try {
      const axios = require('axios');
      
      if (!process.env.SARVAM_API_KEY || process.env.SARVAM_API_KEY.includes('your-')) {
        return 'mock-audio-base64';
      }

      // Map language code to Sarvam format (e.g., hi -> hi-IN)
      const sarvamLang = language.includes('-') ? language : `${language}-IN`;

      const response = await axios.post(
        `${process.env.SARVAM_API_URL}/text-to-speech`,
        {
          inputs: [text],
          target_language_code: sarvamLang,
          speaker: 'anushka', // aditya not compatible with v2, using anushka
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: 'bulbul:v2' // Upgrade to v2 as v1 is deprecated
        },
        {
          headers: {
            'api-subscription-key': process.env.SARVAM_API_KEY,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return response.data.audios?.[0] || 'mock-audio-base64';
    } catch (error) {
      console.error('SARVAM TTS error:', error.message);
      if (error.response) {
        console.error('Response:', error.response.data);
      }
      return 'mock-audio-base64';
    }
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
