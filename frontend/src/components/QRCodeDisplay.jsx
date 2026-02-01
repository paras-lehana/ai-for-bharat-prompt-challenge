import React, { useState, useEffect } from 'react';
import { FaQrcode, FaDownload, FaTimes, FaSpinner } from 'react-icons/fa';
import { shareAPI } from '../utils/api';

export default function QRCodeDisplay({ listingId, cropType }) {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch QR code when modal opens
  useEffect(() => {
    if (showQR && !qrCode) {
      fetchQRCode();
    }
  }, [showQR]);

  const fetchQRCode = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await shareAPI.generateQR(listingId);
      setQrCode(response.data);
    } catch (err) {
      console.error('Error fetching QR code:', err);
      setError('Failed to generate QR code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async () => {
    try {
      const response = await shareAPI.downloadQR(listingId);

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `listing-${listingId}-qr.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading QR code:', err);
      alert('Failed to download QR code. Please try again.');
    }
  };

  return (
    <>
      {/* QR Code Button */}
      <button
        onClick={() => setShowQR(true)}
        className="btn-secondary flex items-center gap-2 w-full justify-center"
        title="Show QR Code"
      >
        <FaQrcode className="text-lg" />
        <span>QR Code</span>
      </button>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaQrcode className="text-green-600 text-xl" />
                <h3 className="text-lg font-semibold text-gray-900">
                  QR Code
                </h3>
              </div>
              <button
                onClick={() => setShowQR(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSpinner className="text-4xl text-green-600 animate-spin mb-4" />
                  <p className="text-gray-600">Generating QR code...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm">{error}</p>
                  <button
                    onClick={fetchQRCode}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {qrCode && !loading && (
                <div className="space-y-4">
                  {/* QR Code Image */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
                    <img
                      src={qrCode.qrCode}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  </div>

                  {/* Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Scan this QR code to view the listing:
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {cropType || 'Product Listing'}
                    </p>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={downloadQRCode}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FaDownload />
                    <span>Download QR Code</span>
                  </button>

                  {/* Instructions */}
                  <div className="text-xs text-gray-500 text-center">
                    <p>Share this QR code to let others quickly access this listing</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
