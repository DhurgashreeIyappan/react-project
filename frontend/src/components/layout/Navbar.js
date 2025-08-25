import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  FaHome, 
  FaUser, 
  FaSignOutAlt, 
  FaPlus, 
  FaList, 
  FaBookmark, 
  FaSearch, 
  FaSun, 
  FaMoon,
  FaBars,
  FaTimes,
  FaCog,
  FaHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, isAuthenticated, logout, isOwner, isRenter } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  // Role-specific navigation items
  const getNavItems = () => {
    if (isOwner()) {
      return [
        { name: 'Dashboard', path: '/owner-dashboard', icon: <FaHome className="w-4 h-4" /> },
        { name: 'Properties', path: '/my-properties', icon: <FaList className="w-4 h-4" /> },
        { name: 'Add Property', path: '/add-property', icon: <FaPlus className="w-4 h-4" /> },
      ];
    } else if (isRenter()) {
      return [
        { name: 'Dashboard', path: '/renter-dashboard', icon: <FaHome className="w-4 h-4" /> },
        { name: 'Browse', path: '/properties', icon: <FaSearch className="w-4 h-4" /> },
        { name: 'Bookings', path: '/my-bookings', icon: <FaBookmark className="w-4 h-4" /> },
      ];
    }
    return [
      { name: 'Home', path: '/', icon: <FaHome className="w-4 h-4" /> },
      { name: 'Properties', path: '/properties', icon: <FaSearch className="w-4 h-4" /> },
      { name: 'Contact', path: '/contact', icon: <FaHeart className="w-4 h-4" /> },
    ];
  };

  // Role-specific profile menu items
  const getProfileItems = () => {
    if (isOwner()) {
      return [
        { name: 'My Properties', path: '/my-properties', icon: <FaList className="w-4 h-4" /> },
        { name: 'Add Property', path: '/add-property', icon: <FaPlus className="w-4 h-4" /> },
        { name: 'Profile Settings', path: '/profile', icon: <FaCog className="w-4 h-4" /> },
      ];
    } else if (isRenter()) {
      return [
        { name: 'My Bookings', path: '/my-bookings', icon: <FaBookmark className="w-4 h-4" /> },
        { name: 'Profile Settings', path: '/profile', icon: <FaCog className="w-4 h-4" /> },
      ];
    }
    return [
      { name: 'Profile Settings', path: '/profile', icon: <FaCog className="w-4 h-4" /> },
    ];
  };

  const navItems = getNavItems();
  const profileItems = getProfileItems();

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-500/90 to-purple-600/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-md border-b border-transparent shadow-medium transition-all duration-300">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-glow">
                <FaHome className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-white">
                RentNest
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActiveRoute(item.path)
                      ? 'bg-white/10 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <FaSun className="w-5 h-5" /> : <FaMoon className="w-5 h-5" />}
            </motion.button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-glow transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block font-medium">
                    {user?.name || 'Profile'}
                  </span>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-surface rounded-2xl shadow-large border border-border py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-text-primary">{user?.name || 'User'}</p>
                        <p className="text-sm text-text-secondary">{user?.email}</p>
                        <p className="text-xs text-primary-600 font-medium capitalize">
                          {isOwner() ? 'Property Owner' : 'Renter'}
                        </p>
                      </div>

                      {/* Menu Items */}
                      {profileItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center space-x-3 px-4 py-3 text-text-secondary hover:text-primary-600 hover:bg-surface-alt transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      
                      {/* Logout */}
                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-error hover:bg-error/10 transition-colors duration-200"
                        >
                          <FaSignOutAlt className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-border py-4"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-3 ${
                      isActiveRoute(item.path)
                        ? 'bg-primary-500/10 text-primary-500'
                        : 'text-text-secondary hover:text-primary-500 hover:bg-surface-alt'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
                
                {isAuthenticated && (
                  <>
                    <div className="border-t border-border pt-2 mt-2">
                      <p className="px-4 py-2 text-sm text-text-muted">
                        Profile Options
                      </p>
                      {profileItems.map((item) => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="px-4 py-3 text-text-secondary hover:text-primary-500 hover:bg-surface-alt transition-colors duration-200 flex items-center space-x-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-error hover:bg-error/10 transition-colors duration-200 flex items-center space-x-3"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
