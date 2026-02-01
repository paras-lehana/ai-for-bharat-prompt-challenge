/**
 * FILE: frontend/src/components/NavBar.jsx
 * 
 * PURPOSE: Main navigation bar
 */

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiSearch, FiPlusCircle, FiMessageSquare, FiTrendingUp, FiLogOut, FiBook, FiMail, FiShoppingBag, FiBarChart2, FiSettings } from 'react-icons/fi';
import { FaHeart, FaSave, FaBell } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container py-2">
        <div className="flex flex-wrap justify-between items-center min-h-[64px] gap-y-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 min-h-[44px]">
            <span className="text-2xl font-bold text-primary-600">🌾 Mandi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiHome className="w-5 h-5" />
              <span>{t('nav.home')}</span>
            </Link>

            <Link to="/browse" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiSearch className="w-5 h-5" />
              <span>{t('nav.browse')}</span>
            </Link>

            {user?.role === 'vendor' && (
              <Link to="/create-listing" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                <FiPlusCircle className="w-5 h-5" />
                <span>{t('nav.createListing')}</span>
              </Link>
            )}

            <Link to="/negotiations" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiMessageSquare className="w-5 h-5" />
              <span>{t('nav.negotiations')}</span>
            </Link>

            <Link to="/messages" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiMail className="w-5 h-5" />
              <span>{t('nav.messages')}</span>
            </Link>

            <Link to="/transactions" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiShoppingBag className="w-5 h-5" />
              <span>{t('nav.transactions')}</span>
            </Link>

            {user?.role === 'vendor' && (
              <Link to="/analytics" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                <FiBarChart2 className="w-5 h-5" />
                <span>{t('nav.analytics')}</span>
              </Link>
            )}

            <Link to="/prices" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiTrendingUp className="w-5 h-5" />
              <span>{t('nav.prices')}</span>
            </Link>

            <Link to="/guide" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiBook className="w-5 h-5" />
              <span>{t('nav.guide')}</span>
            </Link>

            <Link to="/demo" className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-bold">
              <span className="animate-pulse">🎥</span>
              <span>Demo</span>
            </Link>

            <Link to="/favorites" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FaHeart className="w-5 h-5" />
              <span>Favorites</span>
            </Link>

            <Link to="/saved-searches" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FaSave className="w-5 h-5" />
              <span>Saved</span>
            </Link>

            <Link to="/price-alerts" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FaBell className="w-5 h-5" />
              <span>Alerts</span>
            </Link>

            <Link to="/settings" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiSettings className="w-5 h-5" />
              <span>Settings</span>
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
              title={t('nav.logout')}
            >
              <FiLogOut className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-primary-600 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-white shadow-xl z-50 md:hidden overflow-y-auto">
            <div className="p-4 space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiHome className="w-5 h-5" />
                <span>{t('nav.home')}</span>
              </Link>

              <Link
                to="/browse"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiSearch className="w-5 h-5" />
                <span>{t('nav.browse')}</span>
              </Link>

              {user?.role === 'vendor' && (
                <Link
                  to="/create-listing"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
                >
                  <FiPlusCircle className="w-5 h-5" />
                  <span>{t('nav.createListing')}</span>
                </Link>
              )}

              <Link
                to="/negotiations"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiMessageSquare className="w-5 h-5" />
                <span>{t('nav.negotiations')}</span>
              </Link>

              <Link
                to="/messages"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiMail className="w-5 h-5" />
                <span>{t('nav.messages')}</span>
              </Link>

              <Link
                to="/transactions"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiShoppingBag className="w-5 h-5" />
                <span>{t('nav.transactions')}</span>
              </Link>

              {user?.role === 'vendor' && (
                <Link
                  to="/analytics"
                  onClick={closeMobileMenu}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
                >
                  <FiBarChart2 className="w-5 h-5" />
                  <span>{t('nav.analytics')}</span>
                </Link>
              )}

              <Link
                to="/prices"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiTrendingUp className="w-5 h-5" />
                <span>{t('nav.prices')}</span>
              </Link>

              <Link
                to="/guide"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiBook className="w-5 h-5" />
                <span>{t('nav.guide')}</span>
              </Link>

              <Link
                to="/demo"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-700 font-bold min-h-[48px]"
              >
                <span>🎥</span>
                <span>Watch Demo</span>
              </Link>

              <Link
                to="/favorites"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FaHeart className="w-5 h-5" />
                <span>Favorites</span>
              </Link>

              <Link
                to="/saved-searches"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FaSave className="w-5 h-5" />
                <span>Saved Searches</span>
              </Link>

              <Link
                to="/price-alerts"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FaBell className="w-5 h-5" />
                <span>Price Alerts</span>
              </Link>

              <Link
                to="/settings"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-primary-50 min-h-[48px]"
              >
                <FiSettings className="w-5 h-5" />
                <span>Settings</span>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 text-red-600 w-full min-h-[48px]"
              >
                <FiLogOut className="w-5 h-5" />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-inset-bottom z-40">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary-600 p-2 min-w-[56px] min-h-[56px] justify-center">
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">{t('nav.home')}</span>
          </Link>

          <Link to="/browse" className="flex flex-col items-center text-gray-600 hover:text-primary-600 p-2 min-w-[56px] min-h-[56px] justify-center">
            <FiSearch className="w-6 h-6" />
            <span className="text-xs mt-1">{t('nav.browse')}</span>
          </Link>

          {user?.role === 'vendor' ? (
            <Link to="/create-listing" className="flex flex-col items-center text-gray-600 hover:text-primary-600 p-2 min-w-[56px] min-h-[56px] justify-center">
              <FiPlusCircle className="w-6 h-6" />
              <span className="text-xs mt-1">{t('nav.create')}</span>
            </Link>
          ) : (
            <Link to="/negotiations" className="flex flex-col items-center text-gray-600 hover:text-primary-600 p-2 min-w-[56px] min-h-[56px] justify-center">
              <FiMessageSquare className="w-6 h-6" />
              <span className="text-xs mt-1">{t('nav.offers')}</span>
            </Link>
          )}

          <Link to="/messages" className="flex flex-col items-center text-gray-600 hover:text-primary-600 p-2 min-w-[56px] min-h-[56px] justify-center">
            <FiMail className="w-6 h-6" />
            <span className="text-xs mt-1">{t('nav.messages')}</span>
          </Link>

          <Link to="/transactions" className="flex flex-col items-center text-gray-600 hover:text-primary-600 p-2 min-w-[56px] min-h-[56px] justify-center">
            <FiShoppingBag className="w-6 h-6" />
            <span className="text-xs mt-1">{t('nav.orders')}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

