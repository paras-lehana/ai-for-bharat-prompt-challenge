/**
 * FILE: frontend/src/pages/GeMGuide.jsx
 * 
 * PURPOSE: GeM (Government e-Marketplace) registration guide page
 * 
 * FEATURES:
 *  - Step-by-step registration guide
 *  - Multilingual support
 *  - Document checklist
 *  - Helpful tips
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { integrationAPI } from '../utils/api';
import { FaCheckCircle, FaFileAlt, FaPhone, FaGlobe } from 'react-icons/fa';

const GeMGuide = () => {
  const { user } = useAuth();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGuide();
  }, [user]);

  const fetchGuide = async () => {
    try {
      setLoading(true);
      const language = user?.languagePreference || 'en';
      const response = await integrationAPI.getGeMGuide(language);
      setGuide(response.data.guide);
      setError(null);
    } catch (err) {
      console.error('Error fetching GeM guide:', err);
      setError('Failed to load GeM guide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-white mb-8">
        <h1 className="text-3xl font-bold mb-2">{guide.title}</h1>
        <p className="text-lg opacity-90">{guide.description}</p>
        <div className="mt-4 flex items-center gap-2">
          <FaCheckCircle className="text-yellow-300" />
          <span className="text-sm">Estimated Time: {guide.estimatedTime}</span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <FaGlobe className="text-blue-600 text-xl" />
            <h3 className="font-semibold text-blue-900">Website</h3>
          </div>
          <a 
            href={guide.websiteUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {guide.websiteUrl}
          </a>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <FaPhone className="text-green-600 text-xl" />
            <h3 className="font-semibold text-green-900">Helpline</h3>
          </div>
          <a 
            href={`tel:${guide.helplineNumber}`}
            className="text-green-600 hover:underline text-lg font-semibold"
          >
            {guide.helplineNumber}
          </a>
        </div>
      </div>

      {/* Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Registration Steps</h2>
        <div className="space-y-6">
          {guide.steps.map((step) => (
            <div 
              key={step.stepNumber}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  {step.helpText && (
                    <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                      💡 {step.helpText}
                    </p>
                  )}
                  {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Required Documents:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {step.requiredDocuments.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Required Documents Summary */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FaFileAlt className="text-yellow-600 text-2xl" />
          <h2 className="text-xl font-bold text-gray-800">Complete Document Checklist</h2>
        </div>
        <ul className="grid md:grid-cols-2 gap-2">
          {guide.requiredDocuments.map((doc, idx) => (
            <li key={idx} className="flex items-start gap-2 text-gray-700">
              <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tips */}
      {guide.tips && guide.tips.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Helpful Tips</h2>
          <ul className="space-y-2">
            {guide.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-gray-700">
                <span className="text-green-600 font-bold">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GeMGuide;
