/**
 * FILE: frontend/src/components/ODOPBadge.jsx
 * 
 * PURPOSE: Display ODOP (One District One Product) badge on listings
 * 
 * FEATURES:
 *  - Shows ODOP badge with icon and multilingual text
 *  - Tooltip with description
 *  - Responsive design
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

const ODOPBadge = ({ badge }) => {
  const { user } = useAuth();
  const language = user?.languagePreference || 'en';

  if (!badge) return null;

  const displayName = badge.displayName[language] || badge.displayName.en;
  const description = badge.description[language] || badge.description.en;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md hover:shadow-lg transition-shadow duration-200 group relative">
      <span className="text-lg">{badge.icon}</span>
      <span className="text-sm font-semibold">{displayName}</span>
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {description}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default ODOPBadge;
