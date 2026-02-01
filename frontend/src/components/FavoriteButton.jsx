import { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../utils/api';

export default function FavoriteButton({ listingId, className = '' }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [listingId]);

  const checkFavoriteStatus = async () => {
    try {
      const response = await api.get(`/favorites/check/${listingId}`);
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);
    
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${listingId}`);
        setIsFavorite(false);
      } else {
        await api.post('/favorites', { listingId, notifyOnPriceChange: true });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full hover:bg-gray-100 transition ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart className="text-red-500 text-xl" />
      ) : (
        <FaRegHeart className="text-gray-400 text-xl hover:text-red-500" />
      )}
    </button>
  );
}
