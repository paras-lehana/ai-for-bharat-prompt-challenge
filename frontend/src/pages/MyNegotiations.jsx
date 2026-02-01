import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { negotiationsAPI } from '../utils/api';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';
import PageSummarizer from '../components/PageSummarizer';

export default function MyNegotiations() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNegotiations();
  }, []);

  const loadNegotiations = async () => {
    try {
      const response = await negotiationsAPI.getMyNegotiations();
      setNegotiations(response.data.negotiations || []);
    } catch (error) {
      console.error('Error loading negotiations:', error);
      setNegotiations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (negotiation) => {
    navigate(`/listing/${negotiation.listing.id}`);
  };

  const handleWithdraw = async (negotiationId) => {
    if (!window.confirm('Are you sure you want to withdraw this offer?')) return;

    try {
      await negotiationsAPI.withdraw(negotiationId);
      alert('Offer withdrawn successfully');
      loadNegotiations();
    } catch (error) {
      console.error('Error withdrawing offer:', error);
      alert('Failed to withdraw offer: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
      <h1 className="text-3xl font-bold mb-6">My Negotiations</h1>

      <div className="space-y-4">
        {negotiations.map((negotiation) => (
          <div key={negotiation.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{negotiation.listing.cropType}</h3>
                <div className="text-sm text-gray-600">
                  Asking: ₹{Math.round(negotiation.listing.finalPrice)} | Your Offer: ₹{Math.round(negotiation.lastOffer)}
                </div>
              </div>

              <div className="text-right">
                {negotiation.status === 'active' && (
                  <div className="flex items-center space-x-2 text-yellow-600">
                    <FiClock />
                    <span className="text-sm">Pending</span>
                  </div>
                )}
                {negotiation.status === 'accepted' && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <FiCheck />
                    <span className="text-sm">Accepted</span>
                  </div>
                )}
                {negotiation.status === 'rejected' && (
                  <div className="flex items-center space-x-2 text-red-600">
                    <FiX />
                    <span className="text-sm">Rejected</span>
                  </div>
                )}
              </div>
            </div>

            {negotiation.status === 'active' && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleViewDetails(negotiation)}
                    className="btn-primary flex-1"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleWithdraw(negotiation.id)}
                    className="btn-secondary flex-1"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {negotiations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">No negotiations yet</h3>
            <p className="text-gray-600">Start making offers on listings</p>
          </div>
        )}
      </div>
      {negotiations.length > 0 && <PageSummarizer pageType="negotiations" data={negotiations} />}
    </div>
  );
}
