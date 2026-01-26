import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, pricesAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function CreateListing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  
  const [formData, setFormData] = useState({
    cropType: '',
    quantity: '',
    unit: 'kg',
    basePrice: '',
    qualityTier: 'standard',
    description: '',
    location: {
      latitude: 28.6139,
      longitude: 77.2090,
      address: 'Delhi, India'
    }
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePrice = async () => {
    if (!formData.cropType || !formData.basePrice || !formData.qualityTier) return;

    try {
      const response = await pricesAPI.calculate({
        productName: formData.cropType,
        quantity: formData.quantity,
        qualityTier: formData.qualityTier,
        location: 'Delhi'
      });
      setPriceBreakdown(response.data);
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await listingsAPI.create(formData);
      navigate('/');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">List Your Product</h1>

      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Crop Type *
            </label>
            <input
              type="text"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              onBlur={calculatePrice}
              placeholder="e.g., Tomato, Onion, Wheat"
              className="input-field"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="100"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="quintal">Quintal</option>
                <option value="ton">Ton</option>
                <option value="bag">Bag</option>
                <option value="piece">Piece</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base Price (₹/{formData.unit}) *
            </label>
            <input
              type="number"
              name="basePrice"
              value={formData.basePrice}
              onChange={handleChange}
              onBlur={calculatePrice}
              placeholder="500"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quality Tier *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['premium', 'standard', 'basic'].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, qualityTier: tier });
                    setTimeout(calculatePrice, 100);
                  }}
                  className={`p-4 border-2 rounded-lg ${
                    formData.qualityTier === tier
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  <div className="font-medium capitalize">{tier}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {tier === 'premium' && '×1.2'}
                    {tier === 'standard' && '×1.0'}
                    {tier === 'basic' && '×0.85'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {priceBreakdown && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-bold mb-3">Price Calculation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span className="font-medium">₹{priceBreakdown.basePrice}/{formData.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span>Quality Multiplier:</span>
                  <span className="font-medium">×{priceBreakdown.qualityMultiplier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Demand Adjuster:</span>
                  <span className="font-medium">×{priceBreakdown.demandAdjuster}</span>
                </div>
                <div className="border-t border-primary-300 pt-2 flex justify-between text-lg">
                  <span className="font-bold">Recommended Price:</span>
                  <span className="font-bold text-primary-600">₹{priceBreakdown.finalPrice.toFixed(2)}/{formData.unit}</span>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Additional details about your product..."
              rows="4"
              className="input-field"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
