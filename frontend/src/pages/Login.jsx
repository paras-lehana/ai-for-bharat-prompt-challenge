/**
 * FILE: frontend/src/pages/Login.jsx
 * 
 * PURPOSE: Login page with OTP authentication
 */

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { FiPhone, FiKey } from 'react-icons/fi';

export default function Login() {
  const [step, setStep] = useState('phone'); // 'phone' or 'otp' or 'profile'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOTP] = useState('');
  const [role, setRole] = useState('vendor');
  const [languagePreference, setLanguagePreference] = useState('hi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.sendOTP(phoneNumber);
      setOtpSent(true);
      setStep('otp');
      
      // For development, show OTP
      if (response.data.otp) {
        alert(`Development OTP: ${response.data.otp}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOTP(phoneNumber, otp, {
        role,
        languagePreference
      });
      
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">🌾 Multilingual Mandi</h1>
          <p className="text-gray-600">Trade in Your Language. Negotiate Fairly. Earn More.</p>
        </div>

        {/* Login Card */}
        <div className="card">
          {step === 'phone' && (
            <form onSubmit={handleSendOTP}>
              <h2 className="text-2xl font-bold mb-6">Login with Phone</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+919876543210"
                    className="input-field pl-10"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Format: +91XXXXXXXXXX</p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP}>
              <h2 className="text-2xl font-bold mb-6">Enter OTP</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <div className="relative">
                  <FiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    placeholder="123456"
                    maxLength="6"
                    className="input-field pl-10 text-center text-2xl tracking-widest"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Enter 6-digit OTP sent to {phoneNumber}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`p-4 border-2 rounded-lg ${
                      role === 'vendor'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🌾</div>
                    <div className="font-medium">Vendor</div>
                    <div className="text-xs text-gray-500">Sell products</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 border-2 rounded-lg ${
                      role === 'buyer'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🛒</div>
                    <div className="font-medium">Buyer</div>
                    <div className="text-xs text-gray-500">Buy products</div>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Language
                </label>
                <select
                  value={languagePreference}
                  onChange={(e) => setLanguagePreference(e.target.value)}
                  className="input-field"
                >
                  <option value="hi">हिंदी (Hindi)</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="kn">ಕನ್ನಡ (Kannada)</option>
                  <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="en">English</option>
                </select>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="btn-secondary w-full mt-3"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center text-sm text-gray-600">
          <div>
            <div className="text-2xl mb-1">🎤</div>
            <div>Voice in 6 Languages</div>
          </div>
          <div>
            <div className="text-2xl mb-1">💬</div>
            <div>AI Negotiation</div>
          </div>
          <div>
            <div className="text-2xl mb-1">📊</div>
            <div>Fair Pricing</div>
          </div>
          <div>
            <div className="text-2xl mb-1">⭐</div>
            <div>Trusted Community</div>
          </div>
        </div>
      </div>
    </div>
  );
}
