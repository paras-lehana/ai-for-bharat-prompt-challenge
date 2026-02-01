/**
 * FILE: frontend/src/context/ComparisonContext.jsx
 * 
 * PURPOSE: Context for managing listing comparison state
 * Allows users to select up to 4 listings for side-by-side comparison
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within ComparisonProvider');
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonListings, setComparisonListings] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('comparisonListings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setComparisonListings(parsed);
      } catch (error) {
        console.error('Error loading comparison listings:', error);
      }
    }
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('comparisonListings', JSON.stringify(comparisonListings));
  }, [comparisonListings]);

  const addToComparison = (listing) => {
    if (comparisonListings.length >= 4) {
      return { success: false, message: 'Maximum 4 listings can be compared' };
    }
    
    if (comparisonListings.find(l => l.id === listing.id)) {
      return { success: false, message: 'Listing already in comparison' };
    }

    setComparisonListings([...comparisonListings, listing]);
    return { success: true, message: 'Added to comparison' };
  };

  const removeFromComparison = (listingId) => {
    setComparisonListings(comparisonListings.filter(l => l.id !== listingId));
  };

  const clearComparison = () => {
    setComparisonListings([]);
  };

  const isInComparison = (listingId) => {
    return comparisonListings.some(l => l.id === listingId);
  };

  const canAddMore = () => {
    return comparisonListings.length < 4;
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonListings,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
        count: comparisonListings.length
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
