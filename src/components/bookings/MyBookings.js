import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaCalendar, FaMapMarkerAlt, FaDollarSign, FaClock, FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

// Helper functions moved outside component to be accessible
const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'accepted':
      return 'bg-green-100 text-green-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <FaClock className="w-4 h-4" />;
    case 'accepted':
      return <FaCheck className="w-4 h-4" />;
    case 'rejected':
      return <FaTimes className="w-4 h-4" />;
    case 'completed':
      return <FaCheck className="w-4 h-4" />;
    case 'cancelled':
      return <FaTimes className="w-4 h-4" />;
    default:
      return <FaClock className="w-4 h-4" />;
  }
};

// Mock data for bookings
const mockBookings = [
  {
    _id: 'booking1',
    property: {
      _id: 'prop1',
      title: 'Modern Downtown Apartment',
      location: 'Downtown, City Center',
      price: 2500,
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop']
    },
    user: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    startDate: '2024-02-01',
    endDate: '2024-03-01',
    status: 'pending',
    message: 'I would like to rent this apartment for the month of February.',
    createdAt: '2024-01-15'
  },
  {
    _id: 'booking2',
    property: {
      _id: 'prop2',
      title: 'Cozy Studio Near University',
      location: 'University District',
      price: 1200,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop']
    },
    user: {
      name: 'Sarah Smith',
      email: 'sarah@example.com'
    },
    startDate: '2024-01-20',
    endDate: '2024-02-20',
    status: 'accepted',
    message: 'Perfect location for my studies!',
    createdAt: '2024-01-10'
  },
  {
    _id: 'booking3',
    property: {
      _id: 'prop3',
      title: 'Luxury Villa with Pool',
      location: 'Hillside, Suburbs',
      price: 4500,
      images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop']
    },
    user: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    startDate: '2024-02-15',
    endDate: '2024-03-15',
    status: 'completed',
    message: 'Amazing property, had a great stay!',
    createdAt: '2024-01-05'
  }
];

const MyBookings = () => {
  const { isOwner } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Use mock data instead of API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status } 
            : booking
        )
      );
      
      toast.success(`Booking ${status === 'accepted' ? 'accepted' : 'rejected'} successfully (Demo Mode)`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    return booking.status === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All Bookings', count: bookings.length },
    { id: 'pending', label: 'Pending', count: bookings.filter(b => b.status === 'pending').length },
    { id: 'accepted', label: 'Accepted', count: bookings.filter(b => b.status === 'accepted').length },
    { id: 'completed', label: 'Completed', count: bookings.filter(b => b.status === 'completed').length },
    { id: 'cancelled', label: 'Cancelled', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">
            {isOwner() ? 'Manage property booking requests' : 'Track your rental applications'}
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-sm">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-6xl text-gray-300 mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings found</h3>
            <p className="text-gray-500">
              {activeTab === 'all' 
                ? 'You don\'t have any bookings yet.' 
                : `No ${activeTab} bookings found.`
              }
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isOwner={isOwner()}
                onStatusUpdate={handleStatusUpdate}
                index={index}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Booking Card Component
const BookingCard = ({ booking, isOwner, onStatusUpdate, index, getStatusColor, getStatusIcon }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Property Info */}
          <div className="flex-1">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {booking.property?.images?.[0] ? (
                  <img
                    src={booking.property.images[0]}
                    alt={booking.property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FaEye />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {booking.property?.title || 'Property Title'}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <FaMapMarkerAlt className="text-primary mr-2" />
                  <span>{booking.property?.location || 'Location'}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FaDollarSign className="mr-1" />
                    {booking.property?.price}/month
                  </span>
                  <span className="flex items-center">
                    <FaCalendar className="mr-1" />
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex flex-col items-end space-y-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(booking.status)}`}>
              {getStatusIcon(booking.status)}
              <span className="capitalize">{booking.status}</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {showDetails ? 'Hide' : 'View'} Details
              </button>
              
              {isOwner && booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => onStatusUpdate(booking._id, 'accepted')}
                    className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onStatusUpdate(booking._id, 'rejected')}
                    className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Information */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">User Information</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Name:</span> {booking.user?.name || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {booking.user?.email || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {booking.user?.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><span className="font-medium">Start Date:</span> {new Date(booking.startDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">End Date:</span> {new Date(booking.endDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total Amount:</span> ${booking.totalAmount || 'N/A'}</p>
                  <p><span className="font-medium">Created:</span> {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Message */}
              {booking.message && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-3">Message</h4>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {booking.message}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyBookings;
