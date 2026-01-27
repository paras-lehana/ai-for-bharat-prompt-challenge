/**
 * TranslatedText Component
 * Automatically translates text when language changes
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const translationCache = new Map();

export default function TranslatedText({ children, language = 'en', as: Component = 'span' }) {
  const [translatedText, setTranslatedText] = useState(children);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translateText = async () => {
      // If English or no language, show original
      if (language === 'en' || !language) {
        setTranslatedText(children);
        return;
      }

      // Check cache
      const cacheKey = `${children.substring(0, 100)}-${language}`;
      if (translationCache.has(cacheKey)) {
        setTranslatedText(translationCache.get(cacheKey));
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(`${API_BASE_URL}/voice/translate`, {
          text: children,
          targetLanguage: language
        });

        const translated = response.data.translatedText || children;
        translationCache.set(cacheKey, translated);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(children); // Fallback to original
      } finally {
        setLoading(false);
      }
    };

    translateText();
  }, [children, language]);

  return (
    <Component>
      {loading && language !== 'en' ? `${children}...` : translatedText}
    </Component>
  );
}
