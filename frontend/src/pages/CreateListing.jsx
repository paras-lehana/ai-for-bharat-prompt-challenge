import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { listingsAPI, pricesAPI, qualityAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';

export default function CreateListing() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [assessingQuality, setAssessingQuality] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

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

  const handleQualityCheck = async () => {
    // For MVP, we simulate an image upload if none is selected, using a generic crop image
    // In production, this would use the actual uploaded file
    const mockImage = `https://via.placeholder.com/300?text=${formData.cropType || 'Crop'}`;

    setAssessingQuality(true);
    setAiAnalysis(null);

    try {
      const response = await qualityAPI.assess({
        imageUrl: mockImage, // Send base64 or URL
        cropType: formData.cropType
      });

      const analysis = response.data;
      setAiAnalysis(analysis);

      // Auto-select quality tier based on AI
      if (analysis.tier) {
        setFormData(prev => ({ ...prev, qualityTier: analysis.tier }));
        // Recalculate price
        setTimeout(calculatePrice, 100);
      }
    } catch (error) {
      console.error('AI Assessment failed:', error);
      alert('Could not verify quality AI. Using manual selection.');
    } finally {
      setAssessingQuality(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await listingsAPI.create({
        ...formData,
        images: uploadedImage ? JSON.stringify([uploadedImage]) : null
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">List Your Product</h1>

      <form onSubmit={handleSubmit} className="card">
        <div className="space-y-4 sm:space-y-6">

          {/* Image Upload and AI Check */}
          <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo for Quality Check (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full sm:w-1/3 aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                {uploadedImage ? 'Image Selected' : 'No Image'}
              </div>
              <div className="w-full sm:w-2/3 space-y-2">
                <button
                  type="button"
                  className="w-full btn-secondary text-sm"
                  onClick={() => setUploadedImage('placeholder')} // Mock upload
                >
                  Select Image
                </button>
                <button
                  type="button"
                  className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  onClick={handleQualityCheck}
                  disabled={assessingQuality}
                >
                  {assessingQuality ? (
                    <><span>⚙️</span> Analyzing...</>
                  ) : (
                    <><span>✨</span> Verify Quality (AI)</>
                  )}
                </button>
              </div>
            </div>

            {/* AI Result */}
            {aiAnalysis && (
              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded text-sm animate-fade-in">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-purple-800">AI Quality Assessment</span>
                  <span className="bg-purple-200 text-purple-800 px-2 py-0.5 rounded text-xs font-bold">{aiAnalysis.score}/100</span>
                </div>
                <div className="text-gray-700 space-y-1">
                  <p><strong>Grade:</strong> <span className="uppercase">{aiAnalysis.tier}</span></p>
                  <ul className="list-disc pl-4 text-xs text-gray-600 mt-1">
                    {aiAnalysis.reasoning.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>

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
              autoComplete="off"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                inputMode="decimal"
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
              inputMode="decimal"
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
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {['premium', 'standard', 'basic'].map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, qualityTier: tier });
                    setTimeout(calculatePrice, 100);
                  }}
                  className={`p-3 sm:p-4 border-2 rounded-lg min-h-[64px] sm:min-h-[72px] transition-all ${formData.qualityTier === tier
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-300'
                    }`}
                >
                  <div className="font-medium capitalize text-sm sm:text-base">{tier}</div>
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
              <h3 className="font-bold mb-3 text-sm sm:text-base">Price Calculation</h3>
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
                <div className="border-t border-primary-300 pt-2 flex justify-between text-base sm:text-lg">
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
              className="input-field resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base sm:text-lg"
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}
