import React, { useState, useContext } from 'react';
import { FiMic, FiMicOff, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import api from '../utils/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function KisaanBot({ onClose }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [parsedIntent, setParsedIntent] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [processing, setProcessing] = useState(false);

  const startListening = async () => {
    try {
      setError(null);
      setTranscript('');
      setResponse(null);
      setParsedIntent(null);

      console.log('🎤 Requesting microphone access...');
      
      // Request microphone access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        } 
      });
      
      console.log('✅ Microphone access granted');
      
      // Create MediaRecorder with supported format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          console.log('📦 Audio chunk received:', e.data.size, 'bytes');
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        console.log('🛑 Recording stopped, processing', chunks.length, 'chunks');
        const audioBlob = new Blob(chunks, { type: mimeType });
        console.log('📊 Total audio size:', audioBlob.size, 'bytes');
        await processAudio(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsListening(true);
      setTranscript('🎤 Listening... Speak now!');
      
      console.log('🔴 Recording started');

    } catch (err) {
      console.error('❌ Microphone error:', err);
      setError(`Could not access microphone: ${err.message}`);
    }
  };

  const stopListening = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      console.log('⏹️ Stopping recording...');
      mediaRecorder.stop();
      setIsListening(false);
      setTranscript('Processing your voice...');
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      setProcessing(true);
      setTranscript('🔄 Converting speech to text...');

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result.split(',')[1];
        console.log('📝 Base64 audio length:', base64Audio.length);
        
        try {
          // Step 1: Transcribe audio using SARVAM STT
          console.log('🗣️ Sending to SARVAM STT...');
          const transcribeResponse = await axios.post(`${API_BASE_URL}/voice/transcribe`, {
            audioBase64: base64Audio,
            languageCode: user?.languagePreference || 'hi'
          });
          
          // Defensive check for transcribe response
          if (!transcribeResponse || !transcribeResponse.data || !transcribeResponse.data.text) {
            throw new Error('Invalid transcription response');
          }
          
          const transcribedText = transcribeResponse.data.text;
          console.log('✅ Transcribed:', transcribedText);
          setTranscript(transcribedText);
          
          // Step 2: Parse intent using OpenRouter
          console.log('🤖 Parsing intent with OpenRouter...');
          setTranscript(`${transcribedText}\n\n🤖 Understanding your request...`);
          
          const intentResponse = await axios.post(`${API_BASE_URL}/voice/parse-intent`, {
            text: transcribedText,
            languageCode: user?.languagePreference || 'hi'
          });
          
          // Defensive check for intent response
          if (!intentResponse || !intentResponse.data) {
            throw new Error('Invalid intent parsing response');
          }
          
          const intent = intentResponse.data;
          console.log('✅ Parsed intent:', intent);
          setParsedIntent(intent);
          
          // Step 3: Show confirmation to user
          setResponse({
            text: generateConfirmationMessage(intent),
            intent: intent
          });
          
        } catch (err) {
          console.error('❌ Voice API error:', err);
          console.error('Error details:', err.response?.data);
          
          // Show actual error to user
          const errorMsg = err.response?.data?.error || err.message || 'Failed to process voice';
          setError(`Error: ${errorMsg}. Please check API keys and try again.`);
          setTranscript('');
        } finally {
          setProcessing(false);
        }
      };

    } catch (err) {
      console.error('❌ Processing error:', err);
      setError('Failed to process audio');
      setProcessing(false);
    }
  };

  const generateConfirmationMessage = (intent) => {
    const { intent: action, cropType, location, price, quantity, qualityTier } = intent;
    
    switch (action) {
      case 'price_query':
        return `I understood: You want to know the price of ${cropType || 'crops'}${location ? ` in ${location}` : ''}.`;
      
      case 'search_listings':
        return `I understood: You want to search for ${cropType || 'products'}${location ? ` near ${location}` : ''}.`;
      
      case 'create_listing':
        return `I understood: You want to create a listing for ${cropType || 'a product'}${quantity ? ` (${quantity})` : ''}${price ? ` at ₹${price}` : ''}.`;
      
      case 'make_offer':
        return `I understood: You want to make an offer${cropType ? ` for ${cropType}` : ''}${price ? ` at ₹${price}` : ''}.`;
      
      case 'general_help':
        return 'I can help you with: checking prices, searching products, creating listings, or making offers. What would you like to do?';
      
      default:
        return 'I understood your request. Please confirm to proceed.';
    }
  };

  const executeAction = async () => {
    if (!parsedIntent) return;
    
    const { intent, cropType, location, price, quantity, qualityTier } = parsedIntent;
    
    try {
      switch (intent) {
        case 'price_query':
          // Navigate to price info page with search
          navigate(`/price-info?crop=${cropType || ''}&location=${location || ''}`);
          break;
        
        case 'search_listings':
          // Navigate to browse with filters
          navigate(`/browse?search=${cropType || ''}&location=${location || ''}`);
          break;
        
        case 'create_listing':
          // Check if user is logged in
          const token = localStorage.getItem('token');
          if (!token) {
            setResponse({ 
              text: '⚠️ Please login first to create a listing.',
              error: true 
            });
            setTimeout(() => {
              navigate('/login');
              onClose();
            }, 2000);
            return;
          }

          // Create listing directly via API
          console.log('🚀 Creating listing via API:', { cropType, quantity, price, qualityTier });
          
          const listingData = {
            cropType: cropType || 'Tomato',
            quantity: parseInt(quantity) || 10,
            unit: 'Kg',
            basePrice: parseInt(price) || 10,
            qualityTier: qualityTier || 'standard',
            description: `Fresh ${cropType || 'produce'} from local farm`,
            location: {
              latitude: 28.6139,  // Default Delhi coordinates
              longitude: 77.2090,
              address: location || 'Delhi'
            },
            images: []
          };
          
          console.log('📦 Listing data:', listingData);
          
          const response = await api.post('/listings', listingData);
          
          // Defensive check for response
          if (!response || !response.data || !response.data.listing) {
            throw new Error('Invalid listing creation response');
          }
          
          console.log('✅ Listing created:', response.data);
          
          // Show success message and navigate to browse
          setResponse({ text: `✅ Listing created successfully! Your ${cropType || 'product'} is now live.` });
          
          setTimeout(() => {
            navigate('/browse');
            onClose();
          }, 2000);
          break;
        
        case 'make_offer':
          // Navigate to browse to find listing
          navigate(`/browse?search=${cropType || ''}`);
          break;
        
        case 'general_help':
          // Navigate to guide
          navigate('/guide');
          break;
        
        default:
          navigate('/browse');
      }
      
      if (intent !== 'create_listing') {
        onClose();
      }
    } catch (err) {
      console.error('❌ Action execution error:', err);
      setError(`Failed to execute action: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold mb-2">Kisaan Bot</h2>
          <p className="text-gray-600 text-sm">
            Ask me anything in your language!
          </p>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={processing}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : processing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isListening ? (
              <FiMicOff className="w-12 h-12 text-white" />
            ) : (
              <FiMic className="w-12 h-12 text-white" />
            )}
          </button>
        </div>

        {/* Status */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-600 mb-1">You said:</div>
            <div className="font-medium whitespace-pre-line">{transcript}</div>
          </div>
        )}

        {/* Parsed Intent Confirmation */}
        {parsedIntent && response && (
          <div className="bg-primary-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-primary-600 mb-1">Kisaan Bot:</div>
            <div className="font-medium mb-3">{response.text}</div>
            
            <div className="flex space-x-2">
              <button
                onClick={executeAction}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
              >
                <FiCheck className="w-5 h-5" />
                <span>Confirm</span>
              </button>
              <button
                onClick={() => {
                  setParsedIntent(null);
                  setResponse(null);
                  setTranscript('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-sm text-red-600">{error}</div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500">
          <p>Click the microphone to start speaking</p>
          <p className="mt-1">Supported: Hindi, English, and 20+ Indian languages</p>
        </div>
      </div>
    </div>
  );
}
