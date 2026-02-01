import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaLink, FaShare } from 'react-icons/fa';
import { analyticsAPI } from '../utils/api';

export default function ShareButton({ listing }) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate shareable URL
  const getShareableUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/listing/${listing.id}`;
  };

  // Generate share message
  const getShareMessage = () => {
    const url = getShareableUrl();
    return `Check out this ${listing.cropType} listing on Multilingual Mandi!\n\n` +
           `🌾 Crop: ${listing.cropType}\n` +
           `💰 Price: ₹${listing.finalPrice}/${listing.unit}\n` +
           `📦 Quantity: ${listing.quantity} ${listing.unit}\n` +
           `⭐ Quality: ${listing.qualityTier}\n` +
           `📍 Location: ${listing.locationAddress || 'Available'}\n\n` +
           `View details: ${url}`;
  };

  // Track share analytics
  const trackShare = async (method) => {
    try {
      await analyticsAPI.trackShare({ 
        listingId: listing.id, 
        method 
      });
      console.log(`Listing ${listing.id} shared via ${method}`);
    } catch (error) {
      // Fail silently - don't block sharing if tracking fails
      console.error('Error tracking share:', error);
    }
  };

  // WhatsApp sharing
  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(getShareMessage());
    const whatsappUrl = `https://wa.me/?text=${message}`;
    window.open(whatsappUrl, '_blank');
    trackShare('whatsapp');
    setShowShareMenu(false);
  };

  // SMS sharing
  const shareViaSMS = () => {
    const message = encodeURIComponent(getShareMessage());
    const smsUrl = `sms:?body=${message}`;
    window.location.href = smsUrl;
    trackShare('sms');
    setShowShareMenu(false);
  };

  // Email sharing
  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${listing.cropType} Listing - Multilingual Mandi`);
    const body = encodeURIComponent(getShareMessage());
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
    trackShare('email');
    setShowShareMenu(false);
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      const url = getShareableUrl();
      await navigator.clipboard.writeText(url);
      setCopySuccess(true);
      trackShare('copy_link');
      setTimeout(() => {
        setCopySuccess(false);
        setShowShareMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getShareableUrl();
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        trackShare('copy_link');
        setTimeout(() => {
          setCopySuccess(false);
          setShowShareMenu(false);
        }, 2000);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="btn-secondary flex items-center gap-2 w-full justify-center"
        title="Share this listing"
      >
        <FaShare className="text-lg" />
        <span>Share</span>
      </button>

      {/* Share Menu Dropdown */}
      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Menu */}
          <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-2">
                Share via
              </div>
              
              {/* WhatsApp */}
              <button
                onClick={shareOnWhatsApp}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-green-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaWhatsapp className="text-white text-xl" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-xs text-gray-500">Share with contacts</div>
                </div>
              </button>

              {/* SMS */}
              <button
                onClick={shareViaSMS}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-blue-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">SMS</div>
                  <div className="text-xs text-gray-500">Send via text message</div>
                </div>
              </button>

              {/* Email */}
              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-purple-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Email</div>
                  <div className="text-xs text-gray-500">Share via email</div>
                </div>
              </button>

              {/* Copy Link */}
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                  <FaLink className="text-white text-xl" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {copySuccess ? '✓ Copied!' : 'Copy Link'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {copySuccess ? 'Link copied to clipboard' : 'Copy to clipboard'}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
