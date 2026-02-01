import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTrash, FaPlay, FaBell, FaBellSlash, FaEdit } from 'react-icons/fa';
import { savedSearchesAPI } from '../utils/api';

export default function SavedSearches() {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(null);
  const [editingSearch, setEditingSearch] = useState(null);
  const [editName, setEditName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSavedSearches();
  }, []);

  const fetchSavedSearches = async () => {
    try {
      const response = await savedSearchesAPI.getAll();
      setSearches(response.data);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeSearch = async (searchId) => {
    setExecuting(searchId);
    try {
      const response = await savedSearchesAPI.execute(searchId);
      // Navigate to browse page with results
      navigate('/browse', { state: { searchResults: response.data.results } });
    } catch (error) {
      console.error('Error executing search:', error);
      alert('Failed to execute search. Please try again.');
    } finally {
      setExecuting(null);
    }
  };

  const deleteSearch = async (searchId) => {
    if (!confirm('Are you sure you want to delete this saved search?')) {
      return;
    }
    
    try {
      await savedSearchesAPI.delete(searchId);
      setSearches(searches.filter(s => s.id !== searchId));
    } catch (error) {
      console.error('Error deleting search:', error);
      alert('Failed to delete search. Please try again.');
    }
  };

  const startEdit = (search) => {
    setEditingSearch(search);
    setEditName(search.name);
  };

  const cancelEdit = () => {
    setEditingSearch(null);
    setEditName('');
  };

  const saveEdit = async () => {
    if (!editName.trim()) {
      alert('Please enter a name for this search');
      return;
    }

    try {
      const response = await savedSearchesAPI.update(editingSearch.id, {
        name: editName
      });
      
      setSearches(searches.map(s => 
        s.id === editingSearch.id ? response.data : s
      ));
      
      setEditingSearch(null);
      setEditName('');
    } catch (error) {
      console.error('Error updating search:', error);
      alert('Failed to update search. Please try again.');
    }
  };

  const toggleNotifications = async (search) => {
    try {
      const response = await savedSearchesAPI.update(search.id, {
        notifyOnMatch: !search.notifyOnMatch
      });
      
      setSearches(searches.map(s => 
        s.id === search.id ? response.data : s
      ));
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert('Failed to update notifications. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-6">
        <FaSearch className="text-blue-500 text-2xl" />
        <h1 className="text-3xl font-bold">Saved Searches</h1>
      </div>

      {searches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <FaSearch className="text-gray-300 text-6xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No saved searches yet</p>
          <button
            onClick={() => navigate('/browse')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Searching
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <div key={search.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              {editingSearch?.id === search.id ? (
                // Edit Mode
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search name"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{search.name}</h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {search.searchCriteria.crop && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {search.searchCriteria.crop}
                        </span>
                      )}
                      {search.searchCriteria.location && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          📍 {search.searchCriteria.location}
                        </span>
                      )}
                      {search.searchCriteria.quality && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                          {search.searchCriteria.quality}
                        </span>
                      )}
                      {(search.searchCriteria.minPrice || search.searchCriteria.maxPrice) && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                          ₹{search.searchCriteria.minPrice || '0'} - ₹{search.searchCriteria.maxPrice || '∞'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleNotifications(search)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
                      >
                        {search.notifyOnMatch ? (
                          <>
                            <FaBell className="text-blue-500" />
                            <span>Notifications ON</span>
                          </>
                        ) : (
                          <>
                            <FaBellSlash className="text-gray-400" />
                            <span>Notifications OFF</span>
                          </>
                        )}
                      </button>
                      
                      <span className="text-sm text-gray-500">
                        Created: {new Date(search.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => executeSearch(search.id)}
                      disabled={executing === search.id}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition"
                      title="Execute search"
                    >
                      <FaPlay />
                      {executing === search.id ? 'Running...' : 'Run'}
                    </button>
                    <button
                      onClick={() => startEdit(search)}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2 transition"
                      title="Edit search name"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition"
                      title="Delete search"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
