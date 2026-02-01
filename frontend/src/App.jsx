/**
 * FILE: frontend/src/App.jsx
 * 
 * PURPOSE: Main application component with routing
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authAPI } from './utils/api';
import { useTranslation } from 'react-i18next';

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
import Messages from './pages/Messages';
import Transactions from './pages/Transactions';
import TransactionDetail from './pages/TransactionDetail';
import Analytics from './pages/Analytics';
import Disputes from './pages/Disputes';
import Favorites from './pages/Favorites';
import SavedSearches from './pages/SavedSearches';
import PriceAlerts from './pages/PriceAlerts';
import GeMGuide from './pages/GeMGuide';
import Settings from './pages/Settings';
import CompareListings from './pages/CompareListings';
import Community from './pages/Community';

// Components
import NavBar from './components/NavBar';
import LoadingSpinner from './components/LoadingSpinner';
import OfflineIndicator from './components/OfflineIndicator';
import InstallPrompt from './components/InstallPrompt';
import DevTools from './components/DevTools';

// Context
import { AuthContext } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ComparisonProvider } from './context/ComparisonContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        const userData = response.data;
        setUser(userData);

        // Apply user's language preference
        if (userData.languagePreference) {
          i18n.changeLanguage(userData.languagePreference);
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  };

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);

    // Apply user's language preference on login
    if (userData.languagePreference) {
      i18n.changeLanguage(userData.languagePreference);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      <LanguageProvider>
        <ThemeProvider>
          <ComparisonProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {user && <NavBar />}

                <Routes>
                  <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
                  <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                  <Route path="/browse" element={user ? <BrowseListings /> : <Navigate to="/login" />} />
                  <Route path="/compare" element={user ? <CompareListings /> : <Navigate to="/login" />} />
                  <Route path="/create-listing" element={user ? <CreateListing /> : <Navigate to="/login" />} />
                  <Route path="/listing/:id" element={user ? <ListingDetail /> : <Navigate to="/login" />} />
                  <Route path="/vendor/:id" element={user ? <VendorProfile /> : <Navigate to="/login" />} />
                  <Route path="/negotiations" element={user ? <MyNegotiations /> : <Navigate to="/login" />} />
                  <Route path="/prices" element={user ? <PriceInfo /> : <Navigate to="/login" />} />
                  <Route path="/guide" element={user ? <Guide /> : <Navigate to="/login" />} />
                  <Route path="/messages" element={user ? <Messages /> : <Navigate to="/login" />} />
                  <Route path="/messages/:recipientId" element={user ? <Messages /> : <Navigate to="/login" />} />
                  <Route path="/transactions" element={user ? <Transactions /> : <Navigate to="/login" />} />
                  <Route path="/transaction/:id" element={user ? <TransactionDetail /> : <Navigate to="/login" />} />
                  <Route path="/analytics" element={user ? <Analytics /> : <Navigate to="/login" />} />
                  <Route path="/disputes" element={user ? <Disputes /> : <Navigate to="/login" />} />
                  <Route path="/favorites" element={user ? <Favorites /> : <Navigate to="/login" />} />
                  <Route path="/saved-searches" element={user ? <SavedSearches /> : <Navigate to="/login" />} />
                  <Route path="/price-alerts" element={user ? <PriceAlerts /> : <Navigate to="/login" />} />
                  <Route path="/gem-guide" element={user ? <GeMGuide /> : <Navigate to="/login" />} />
                  <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
                  <Route path="/community" element={user ? <Community /> : <Navigate to="/login" />} />
                </Routes>

                {/* PWA Components */}
                <OfflineIndicator />
                {user && <InstallPrompt />}
                <DevTools />
              </div>
            </Router>
          </ComparisonProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthContext.Provider>
  );
}

export default App;
