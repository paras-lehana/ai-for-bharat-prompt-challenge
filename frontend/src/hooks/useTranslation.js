/**
 * Translation Hook
 * Provides dynamic translation for any text content
 */

import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Cache translations to avoid repeated API calls
const translationCache = new Map();

export function useTranslation() {
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text, targetLanguage) => {
    // If English, return as-is
    if (targetLanguage === 'en' || !targetLanguage) {
      return text;
    }

    // Check cache first
    const cacheKey = `${text.substring(0, 100)}-${targetLanguage}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey);
    }

    setTranslating(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/voice/translate`, {
        text,
        targetLanguage
      });

      const translated = response.data.translatedText || text;
      
      // Cache the result
      translationCache.set(cacheKey, translated);
      
      return translated;
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.message);
      return text; // Return original on error
    } finally {
      setTranslating(false);
    }
  }, []);

  const translateMultiple = useCallback(async (texts, targetLanguage) => {
    if (targetLanguage === 'en' || !targetLanguage) {
      return texts;
    }

    const promises = texts.map(text => translate(text, targetLanguage));
    return Promise.all(promises);
  }, [translate]);

  return {
    translate,
    translateMultiple,
    translating,
    error
  };
}

export default useTranslation;
