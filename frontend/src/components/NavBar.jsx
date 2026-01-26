/**
 * FILE: frontend/src/components/NavBar.jsx
 * 
 * PURPOSE: Main navigation bar
 */

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FiHome, FiSearch, FiPlusCircle, FiMessageSquare, FiTrendingUp, FiLogOut } from 'react-icons/fi';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">🌾 Mandi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiHome className="w-5 h-5" />
              <span>Home</span>
            </Link>
            
            <Link to="/browse" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiSearch className="w-5 h-5" />
              <span>Browse</span>
            </Link>

            {user?.role === 'vendor' && (
              <Link to="/create-listing" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
                <FiPlusCircle className="w-5 h-5" />
                <span>List Product</span>
              </Link>
            )}

            <Link to="/negotiations" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiMessageSquare className="w-5 h-5" />
              <span>Negotiations</span>
            </Link>

            <Link to="/prices" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600">
              <FiTrendingUp className="w-5 h-5" />
              <span>Prices</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-primary-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
            <FiHome className="w-6 h-6" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link to="/browse" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
            <FiSearch className="w-6 h-6" />
            <span className="text-xs mt-1">Browse</span>
          </Link>

          {user?.role === 'vendor' && (
            <Link to="/create-listing" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
              <FiPlusCircle className="w-6 h-6" />
              <span className="text-xs mt-1">List</span>
            </Link>
          )}

          <Link to="/negotiations" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
            <FiMessageSquare className="w-6 h-6" />
            <span className="text-xs mt-1">Offers</span>
          </Link>

          <Link to="/prices" className="flex flex-col items-center text-gray-600 hover:text-primary-600">
            <FiTrendingUp className="w-6 h-6" />
            <span className="text-xs mt-1">Prices</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
