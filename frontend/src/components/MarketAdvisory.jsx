/**
 * FILE: frontend/src/components/MarketAdvisory.jsx
 * 
 * PURPOSE: Display market news and farming advisories
 * Shows relevant agricultural news with dynamic rotation
 */

import React, { useState, useEffect } from 'react';
import { FiInfo, FiTrendingUp, FiCloud, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MarketAdvisory = ({ location = "Punjab" }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Static advisories that rotate - simulates news feed
    const advisories = [
        {
            type: 'market',
            icon: <FiTrendingUp className="text-green-600" />,
            title: 'Wheat Prices Rising',
            content: `Wheat prices in ${location} are expected to increase by 5-10% next week due to high procurement demand.`,
            color: 'bg-green-50 border-green-200',
            source: 'Market Advisory',
            sourceUrl: 'https://enam.gov.in/web/dashboard/trade-data'
        },
        {
            type: 'weather',
            icon: <FiCloud className="text-blue-600" />,
            title: 'Weather Alert',
            content: 'Light rainfall expected in next 3-5 days. Plan your harvest accordingly to avoid crop damage.',
            color: 'bg-blue-50 border-blue-200',
            source: 'IMD Advisory',
            sourceUrl: 'https://mausam.imd.gov.in/responsive/all_india_forcast.php'
        },
        {
            type: 'scheme',
            icon: <FiInfo className="text-purple-600" />,
            title: 'PM-KISAN Update',
            content: 'New registration window open for PM-KISAN Yojana. Eligible farmers can receive ₹6,000/year directly.',
            color: 'bg-purple-50 border-purple-200',
            source: 'Government Scheme',
            sourceUrl: 'https://pmkisan.gov.in/NewRegistration.aspx'
        },
        {
            type: 'market',
            icon: <FiTrendingUp className="text-orange-600" />,
            title: 'Onion Supply Alert',
            content: 'Onion supply shortage expected. Current stocks may see 15-20% price increase this month.',
            color: 'bg-orange-50 border-orange-200',
            source: 'Agmarknet',
            sourceUrl: 'https://agmarknet.gov.in/SearchReports/SearchRep.aspx'
        },
        {
            type: 'alert',
            icon: <FiAlertCircle className="text-red-600" />,
            title: 'Pest Alert',
            content: 'Increased armyworm activity reported in Maize fields. Apply recommended pesticides immediately.',
            color: 'bg-red-50 border-red-200',
            source: 'CIBRC Alert',
            sourceUrl: 'https://ppqs.gov.in/divisions/cib-rc/major-uses-of-pesticides'
        },
        {
            type: 'market',
            icon: <FiTrendingUp className="text-teal-600" />,
            title: 'Export Opportunity',
            content: 'High demand for Basmati rice in international markets. Consider quality grading for better prices.',
            color: 'bg-teal-50 border-teal-200',
            source: 'APEDA Update',
            sourceUrl: 'https://apeda.gov.in/apedawebsite/Subsidies/Financial_Assistance_Schemes.htm'
        }
    ];

    // Auto-rotate advisories
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % advisories.length);
        }, 8000); // Change every 8 seconds

        return () => clearInterval(interval);
    }, [advisories.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + advisories.length) % advisories.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % advisories.length);
    };

    const current = advisories[currentIndex];

    return (
        <div className={`rounded-xl p-5 border-l-4 ${current.color} transition-all duration-500 animate-fade-in`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                    <div className="text-2xl mt-1">
                        {current.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{current.title}</h3>
                            <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full text-gray-600">
                                {current.source}
                            </span>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base mb-2">
                            {current.content}
                        </p>
                        {current.sourceUrl && (
                            <a
                                href={current.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-semibold text-primary-600 hover:text-primary-700 underline flex items-center gap-1"
                            >
                                <FiInfo className="w-3 h-3" />
                                View Source
                            </a>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={goToPrevious}
                        className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                        aria-label="Previous advisory"
                    >
                        <FiChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="p-1.5 rounded-full hover:bg-white/50 transition-colors"
                        aria-label="Next advisory"
                    >
                        <FiChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Indicator dots */}
            <div className="flex justify-center gap-1.5 mt-4">
                {advisories.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-gray-600 w-4' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to advisory ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MarketAdvisory;
