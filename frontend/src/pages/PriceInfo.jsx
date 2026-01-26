import React, { useState, useEffect } from 'react';
import { pricesAPI } from '../utils/api';

export default function PriceInfo() {
  const [selectedCrop, setSelectedCrop] = useState('tomato');
  const [priceData, setPriceData] = useState(null);

  const crops = ['tomato', 'onion', 'potato', 'wheat', 'rice'];

  useEffect(() => {
    loadPriceData();
  }, [selectedCrop]);

  const loadPriceData = async () => {
    try {
      const response = await pricesAPI.getCurrent(selectedCrop, 'Delhi');
      setPriceData(response.data);
    } catch (error) {
      console.error('Error loading prices:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">Market Prices</h1>

      {/* Crop Selector */}
      <div className="card mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Crop
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="input-field"
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Price Display */}
      {priceData && (
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 capitalize">{selectedCrop} Prices</h2>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Modal Price</div>
              <div className="text-3xl font-bold text-green-600">₹{priceData.modalPrice}</div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Min Price</div>
              <div className="text-3xl font-bold text-blue-600">₹{priceData.minPrice}</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Max Price</div>
              <div className="text-3xl font-bold text-orange-600">₹{priceData.maxPrice}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Source: {priceData.source === 'enam_api' ? 'eNAM' : 'Local'}</span>
              <span>Location: {priceData.location || 'Delhi'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Advisory */}
      <div className="card mt-6 bg-primary-50 border border-primary-200">
        <h3 className="font-bold mb-2">💡 Market Advisory</h3>
        <p className="text-sm text-gray-700">
          {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} prices are stable. 
          Good time to sell if you have stock. Demand expected to remain steady.
        </p>
      </div>
    </div>
  );
}
