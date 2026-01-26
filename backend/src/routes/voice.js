const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');

// Mock voice query processing
router.post('/query', asyncHandler(async (req, res) => {
  const { audioBase64, languageCode = 'hi' } = req.body;

  // Mock transcription
  const transcribedText = "टमाटर का भाव क्या है?";
  
  // Mock price lookup
  const responseText = "आज दिल्ली मंडी में टमाटर ₹28-32/kg चल रहा है।";
  
  // Mock TTS (return same text for now)
  const responseAudio = "mock-audio-base64";

  res.json({
    success: true,
    text: responseText,
    audio: responseAudio,
    languageCode,
    transcribedText
  });
}));

router.post('/transcribe', asyncHandler(async (req, res) => {
  const { audioBase64, languageCode } = req.body;
  
  res.json({
    text: "Mock transcription",
    languageCode
  });
}));

router.post('/synthesize', asyncHandler(async (req, res) => {
  const { text, languageCode } = req.body;
  
  res.json({
    audio: "mock-audio-base64",
    languageCode
  });
}));

module.exports = router;
