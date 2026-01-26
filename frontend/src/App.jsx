/**
 * FILE: frontend/src/App.jsx
 * 
 * PURPOSE: Main application component with routing
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './utils/api';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import BrowseListings from './pages/BrowseListings';
import CreateListing from './pages/CreateListing';
import ListingDetail from './pages/ListingDetail';
import VendorProfile from './pages/VendorProfile';
import MyNegotiations from './pages/MyNegotiations';
import PriceInfo from './pages/PriceInfo';
import Guide from './pages/Guide';

// Components
import NavBar from './components/NavBar';
import LoadingSpinner from './components/LoadingSpinner';

// Context
import { AuthContext } from './context/AuthContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {user && <NavBar />}
          
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/browse" element={user ? <BrowseListings /> : <Navigate to="/login" />} />
            <Route path="/create-listing" element={user ? <CreateListing /> : <Navigate to="/login" />} />
            <Route path="/listing/:id" element={user ? <ListingDetail /> : <Navigate to="/login" />} />
            <Route path="/vendor/:id" element={user ? <VendorProfile /> : <Navigate to="/login" />} />
            <Route path="/negotiations" element={user ? <MyNegotiations /> : <Navigate to="/login" />} />
            <Route path="/prices" element={user ? <PriceInfo /> : <Navigate to="/login" />} />
            <Route path="/guide" element={user ? <Guide /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
