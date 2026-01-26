import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiClock, FiCheck, FiX } from 'react-icons/fi';

export default function MyNegotiations() {
  const { user } = useContext(AuthContext);
  const [negotiations, setNegotiations] = useState([]);

  // Mock data for MVP
  useEffect(() => {
    setNegotiations([
      {
        id: '1',
        listing: { cropType: 'Tomato', finalPrice: 30 },
        status: 'active',
        lastOffer: 28,
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000)
      },
      {
        id: '2',
        listing: { cropType: 'Onion', finalPrice: 40 },
        status: 'accepted',
        lastOffer: 38,
        expiresAt: new Date()
      }
    ]);
  }, []);

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
                  Asking: ₹{negotiation.listing.finalPrice} | Your Offer: ₹{negotiation.lastOffer}
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
                  <button className="btn-primary flex-1">View Details</button>
                  <button className="btn-secondary flex-1">Withdraw</button>
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
    </div>
  );
}
