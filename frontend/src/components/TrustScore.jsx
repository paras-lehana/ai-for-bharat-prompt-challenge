/**
 * FILE: frontend/src/components/TrustScore.jsx
 * 
 * PURPOSE: Reusable trust score display component
 * 
 * FEATURES:
 *  - Display overall trust score
 *  - Show breakdown (delivery, quality, response, pricing)
 *  - Display badges (Trusted Vendor, Verified Seller)
 *  - Transaction count
 */

import React from 'react';
import TranslatedText from './TranslatedText';

function TrustScore({ trustScore, breakdown, badges, transactionCount, compact = false }) {
  const getScoreColor = (score) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBadgeIcon = (badge) => {
    if (badge === 'Trusted Vendor') return '🏆';
    if (badge === 'Verified Seller') return '✓';
    return '⭐';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`text-lg font-bold ${getScoreColor(trustScore)}`}>
          ⭐ {trustScore?.toFixed(1) || 'N/A'}
        </div>
        {badges && badges.length > 0 && (
          <div className="flex gap-1">
            {badges.map((badge, index) => (
              <span
                key={index}
                className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full"
                title={badge}
              >
                {getBadgeIcon(badge)}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4">
        <TranslatedText text="Trust Score" />
      </h3>

      {/* Overall Score */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${getScoreColor(trustScore)}`}>
          {trustScore?.toFixed(1) || 'N/A'}
        </div>
        <div className="text-gray-600 mt-2">
          <TranslatedText text="out of 5.0" />
        </div>
        {transactionCount && (
          <div className="text-sm text-gray-500 mt-1">
            {transactionCount} <TranslatedText text="transactions" />
          </div>
        )}
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <TranslatedText text="Delivery" />
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(breakdown.delivery / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold w-8">
                {breakdown.delivery?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <TranslatedText text="Quality" />
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(breakdown.quality / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold w-8">
                {breakdown.quality?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <TranslatedText text="Response" />
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(breakdown.response / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold w-8">
                {breakdown.response?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              <TranslatedText text="Fair Pricing" />
            </span>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${(breakdown.fairPricing / 5) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-semibold w-8">
                {breakdown.fairPricing?.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3">
            <TranslatedText text="Badges" />
          </h4>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-2 rounded-lg shadow-md"
              >
                <span className="text-lg">{getBadgeIcon(badge)}</span>
                <span className="text-sm font-semibold">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrustScore;
