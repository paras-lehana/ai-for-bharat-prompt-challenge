import React, { useState, useContext } from 'react';
import { FiVolume2, FiStopCircle, FiPlay } from 'react-icons/fi';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const PageSummarizer = ({ pageType, data }) => {
    const { user } = useContext(AuthContext);
    const { t, i18n } = useTranslation();
    const [isPlaying, setIsPlaying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [audio, setAudio] = useState(null);

    const generateSummaryText = () => {
        // Generate context-aware summary based on page type
        switch (pageType) {
            case 'listing_detail':
                return `This is a listing for ${data.cropType}. The price is ${Math.round(data.finalPrice)} rupees per ${data.unit}. The quality is ${data.qualityTier}. The vendor has a rating of 4.2 stars.`;

            case 'negotiations':
                const activeCount = data.filter(n => n.status === 'active').length;
                const latest = data[0];
                return `You have ${activeCount} active negotiations. Your latest offer was for ${latest?.listing?.cropType || 'a crop'} at ${Math.round(latest?.lastOffer || 0)} rupees.`;

            case 'analytics':
                return `Market trends show that ${data.cropType || 'wheat'} prices are stable. Demand is ${data.demandAdjuster > 1 ? 'high' : 'normal'} in your area.`;

            default:
                return 'Here is the summary of the current page.';
        }
    };

    const handlePlaySummary = async () => {
        if (isPlaying) {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
            setIsPlaying(false);
            return;
        }

        try {
            setLoading(true);
            const languageCode = user?.languagePreference || i18n.language || 'hi';

            console.log('🗣️ Requesting AI page summary...');

            const response = await axios.post(`${API_BASE_URL}/voice/page-summary`, {
                pageType,
                data,
                languageCode
            });

            if (response.data.audio) {
                console.log('🔊 Received audio data, length:', response.data.audio.length);
                const audioSrc = `data:audio/wav;base64,${response.data.audio}`;
                const newAudio = new Audio(audioSrc);

                newAudio.onended = () => setIsPlaying(false);
                newAudio.play();

                setAudio(newAudio);
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing summary:', error);
            alert('Could not play summary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePlaySummary}
            disabled={loading}
            className={`fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 ${isPlaying
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
                <>
                    <FiStopCircle className="text-xl" />
                    <span className="font-medium">Stop</span>
                </>
            ) : (
                <>
                    <FiVolume2 className="text-xl" />
                    <span className="font-medium">Summary</span>
                </>
            )}
        </button>
    );
};

export default PageSummarizer;
