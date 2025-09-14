import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import client from '../../api/client';
import { FaUser, FaEnvelope, FaPhone, FaEdit, FaCamera, FaSave, FaTimes, FaHome, FaUserTie } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profilePicture: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [stats, setStats] = useState({ propertiesListed: 0, bookingsMade: 0, bookingsReceived: 0, reviewsGiven: 0 });

  const fetchStats = useCallback(async () => {
    try {
      // Parallel fetches depending on role
      if (user.role === 'owner') {
        const [propsRes, bookingsRes] = await Promise.all([
          client.get('/properties/me/all'),
          client.get('/bookings')
        ]);
        setStats({
          propertiesListed: propsRes.data.properties?.length || 0,
          bookingsReceived: bookingsRes.data.bookings?.length || 0,
          bookingsMade: 0,
          reviewsGiven: 0,
        });
      } else if (user.role === 'renter') {
        const [bookingsRes] = await Promise.all([
          client.get('/bookings/me')
        ]);
        setStats({
          propertiesListed: 0,
          bookingsMade: bookingsRes.data.bookings?.length || 0,
          bookingsReceived: 0,
          reviewsGiven: 0,
        });
      }
    } catch (err) {
      // Non-fatal
    }
  }, [user?.role]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || null
      });
      fetchStats();
    }
  }, [user, fetchStats]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          profilePicture: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else {
      const digits = formData.phone.replace(/\s/g, '');
      if (!/^\+?[1-9]\d{0,15}$/.test(digits)) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      profilePicture: user.profilePicture || null
    });
    setErrors({});
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-app-pattern py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </motion.div>

        {/* Profile Information Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <div className="relative mb-8">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white">
                    {formData.profilePicture ? (
                      <img
                        src={formData.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                        <FaUser className="text-white text-5xl" />
                      </div>
                    )}
                  </div>
                </div>
                
                {isEditing && (
                  <label className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    <FaCamera className="text-lg" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {user.name || 'User Name'}
              </h2>
              
              {/* Role Badge */}
              <div className="mb-6">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  user.role === 'owner' 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' 
                    : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
                }`}>
                  {user.role === 'owner' ? (
                    <FaHome className="mr-2 text-green-600" />
                  ) : (
                    <FaUserTie className="mr-2 text-blue-600" />
                  )}
                  {user.role === 'owner' ? 'Property Owner' : 'Property Renter'}
                </span>
              </div>

              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="w-full btn-primary"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Profile Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      disabled={!isEditing}
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 ${
                        !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-300'
                      } ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 ${
                        !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-300'
                      } ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      disabled={!isEditing}
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 ${
                        !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-300'
                      } ${errors.phone ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Bio Field */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-3">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    disabled={!isEditing}
                    value={formData.bio}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-gray-700 placeholder-gray-400 resize-none ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-300'
                    }`}
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex space-x-4 pt-6">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <>
                          <FaSave className="mr-2" />
                          Save Changes
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-8 py-4 bg-gray-200 text-gray-700 font-bold text-lg rounded-xl hover:bg-gray-300 transform hover:scale-105 transition-all duration-300"
                    >
                      <FaTimes className="mr-2" />
                      Cancel
                    </motion.button>
                  </div>
                )}
              </form>
            </div>

            {/* Account Stats */}
            <div className="mt-8 bg-white rounded-3xl shadow-2xl p-8" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Statistics</h3>
              {user.role === 'owner' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">🏠</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{stats.propertiesListed}</div>
                        <div className="text-sm opacity-90">Properties Listed</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">📅</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{stats.bookingsReceived}</div>
                        <div className="text-sm opacity-90">Bookings Received</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">⭐</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{stats.reviewsGiven}</div>
                        <div className="text-sm opacity-90">Reviews Given</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">🏠</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{stats.bookingsMade}</div>
                        <div className="text-sm opacity-90">Properties Booked</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">⭐</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{stats.reviewsGiven}</div>
                        <div className="text-sm opacity-90">Reviews Given</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-3xl">💼</div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{stats.propertiesListed}</div>
                        <div className="text-sm opacity-90">Properties Listed</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
