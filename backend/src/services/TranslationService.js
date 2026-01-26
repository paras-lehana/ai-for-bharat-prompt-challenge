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
   * Translate text to target language using OpenRouter AI
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

      // Use OpenRouter for better translation
      const axios = require('axios');
      
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes('your-')) {
        console.log('OpenRouter API not configured, using mock translation');
        return this.mockTranslate(text, targetLang);
      }

      const targetLangName = this.SUPPORTED_LANGUAGES[targetLang] || targetLang;
      
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: process.env.OPENROUTER_MODEL || 'google/gemini-flash-1.5',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the following text from English to ${targetLangName}. Only return the translated text, nothing else. Preserve markdown formatting if present.`
            },
            {
              role: 'user',
              content: text
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://multilingualmandi.in',
            'X-Title': 'Multilingual Mandi'
          },
          timeout: 15000
        }
      );

      const translatedText = response.data.choices[0]?.message?.content?.trim();
      return translatedText || text;
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

      const response = await axios.post(
        `${process.env.SARVAM_API_URL}/text-to-speech`,
        {
          inputs: [text],
          target_language_code: language,
          speaker: 'meera',
          pitch: 0,
          pace: 1.0,
          loudness: 1.5,
          speech_sample_rate: 8000,
          enable_preprocessing: true,
          model: 'bulbul:v1'
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
