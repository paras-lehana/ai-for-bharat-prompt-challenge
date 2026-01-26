const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const TranslationService = require('../services/TranslationService');
const AIService = require('../services/AIService');
const PricingService = require('../services/PricingService');

// Voice query processing with SARVAM AI + OpenRouter
router.post('/query', asyncHandler(async (req, res) => {
  const { audioBase64, languageCode = 'hi' } = req.body;

  // Step 1: Transcribe audio using SARVAM AI
  const transcribedText = await TranslationService.transcribeAudio(audioBase64, languageCode);
  
  // Step 2: Process query with OpenRouter AI
  const queryAnalysis = await AIService.processVoiceQuery(transcribedText, languageCode);
  
  // Step 3: Generate response based on intent
  let responseText = '';
  
  if (queryAnalysis.intent === 'price_query' && queryAnalysis.cropType) {
    // Get price from eNAM
    const priceData = await PricingService.getENAMPrice(
      queryAnalysis.cropType,
      queryAnalysis.location || 'Delhi'
    );
    
    responseText = `आज ${queryAnalysis.location || 'दिल्ली'} मंडी में ${queryAnalysis.cropType} ₹${priceData.minPrice}-${priceData.maxPrice}/kg चल रहा है।`;
  } else {
    responseText = "मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया फसल का नाम और स्थान बताएं।";
  }
  
  // Step 4: Synthesize response using SARVAM AI
  const responseAudio = await TranslationService.synthesizeSpeech(responseText, languageCode);

  res.json({
    success: true,
    text: responseText,
    audio: responseAudio,
    languageCode,
    transcribedText,
    analysis: queryAnalysis
  });
}));

// Transcribe audio only
router.post('/transcribe', asyncHandler(async (req, res) => {
  const { audioBase64, languageCode = 'hi' } = req.body;
  
  const transcribedText = await TranslationService.transcribeAudio(audioBase64, languageCode);
  
  res.json({
    text: transcribedText,
    languageCode
  });
}));

// Parse intent from transcribed text
router.post('/parse-intent', asyncHandler(async (req, res) => {
  const { text, languageCode = 'hi' } = req.body;
  
  const intent = await AIService.processVoiceQuery(text, languageCode);
  
  res.json(intent);
}));

// Synthesize text to speech
router.post('/synthesize', asyncHandler(async (req, res) => {
  const { text, languageCode = 'hi' } = req.body;
  
  const audio = await TranslationService.synthesizeSpeech(text, languageCode);
  
  res.json({
    audio,
    languageCode
  });
}));

// Translate text to target language
router.post('/translate', asyncHandler(async (req, res) => {
  const { text, targetLanguage = 'hi' } = req.body;
  
  // If target is English, return as-is
  if (targetLanguage === 'en') {
    return res.json({
      translatedText: text,
      targetLanguage
    });
  }
  
  const translatedText = await TranslationService.translateText(text, 'en', targetLanguage);
  
  res.json({
    translatedText,
    targetLanguage
  });
}));

module.exports = router;
