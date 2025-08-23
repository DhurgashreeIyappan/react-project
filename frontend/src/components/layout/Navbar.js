import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaUser, FaSignOutAlt, FaPlus, FaList, FaBookmark, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout, isOwner, isRenter } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Role-specific navigation items
  const getNavItems = () => {
    if (isOwner()) {
      return [
        { name: 'Dashboard', path: '/owner-dashboard', icon: <FaHome /> },
        { name: 'Contact', path: '/contact' },
      ];
    } else if (isRenter()) {
      return [
        { name: 'Dashboard', path: '/renter-dashboard', icon: <FaHome /> },
        { name: 'Browse Properties', path: '/properties', icon: <FaSearch /> },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ];
    }
    return [
      { name: 'Home', path: '/', icon: <FaHome /> },
      { name: 'Properties', path: '/properties', icon: <FaSearch /> },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
    ];
  };

  // Role-specific dropdown menu items
  const getDropdownItems = () => {
    if (isOwner()) {
      return [
        { name: 'My Properties', path: '/my-properties', icon: <FaList /> },
        { name: 'Add Property', path: '/add-property', icon: <FaPlus /> },
        { name: 'Profile', path: '/profile', icon: <FaUser /> },
      ];
    } else if (isRenter()) {
      return [
        { name: 'My Bookings', path: '/my-bookings', icon: <FaBookmark /> },
        { name: 'Profile', path: '/profile', icon: <FaUser /> },
      ];
    }
    return [
      { name: 'Profile', path: '/profile', icon: <FaUser /> },
    ];
  };

  const navItems = getNavItems();
  const dropdownItems = getDropdownItems();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <FaHome className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                RentNest
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium flex items-center space-x-2"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <FaUser />
                  <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
                </motion.button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                  >
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <FaSignOutAlt />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="btn-primary"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-primary transition-colors duration-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-700 hover:text-primary transition-colors duration-300 font-medium flex items-center space-x-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  
                  <button
                    onClick={handleLogout}
                    className="text-left text-red-600 hover:text-red-700 transition-colors duration-300 font-medium flex items-center space-x-2"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
