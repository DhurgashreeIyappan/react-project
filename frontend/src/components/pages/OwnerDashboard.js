import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaEye, FaTrash, FaHome, FaMapMarkerAlt, FaBed, FaBath, FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';
import client, { getImageUrl } from '../../api/client';
import { getDisplayStatus } from '../../utils/status';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties();
    fetchBookings();
  }, []);

  const fetchMyProperties = async () => {
    try {
      const response = await client.get('/properties/me/all');
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  // Unified status is provided by getDisplayStatus

  const canResetProperty = (property) => {
    if (!property) return false;
    const status = getDisplayStatus(property, user, { perspective: 'owner' });
    return status.label === 'Awaiting Reset';
  };

  const handleResetAvailability = async (propertyId) => {
    try {
      await client.post(`/properties/${propertyId}/reset-availability`);
      toast.success('Property reset to Available');
      fetchMyProperties();
    } catch (error) {
      console.error('Error resetting availability:', error);
      toast.error(error?.response?.data?.message || 'Failed to reset availability');
    }
  };

  const fetchBookings = async () => {
    try {
      // The backend now handles filtering bookings for owner's properties
      const bookingsResponse = await client.get('/bookings');
      setBookings(bookingsResponse.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await client.delete(`/properties/${propertyId}`);
        toast.success('Property deleted successfully');
        fetchMyProperties();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await client.put(`/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status} successfully`);
      fetchBookings(); // Refresh bookings
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-app-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Manage your properties and view your listings
            </p>
          </div>
          
          {/* Add Property Button */}
          <div className="mt-4 sm:mt-0">
            <Link
              to="/add-property"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <FaPlus className="mr-2" />
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaHome className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaEye className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.isAvailable).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl font-bold">₹</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">₹{properties.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}</p>
              </div>
            </div>
          </motion.div>


          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FaCalendar className="text-orange-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>


        {/* My Properties section removed from Dashboard as requested */}

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                             <FaCalendar className="mr-2 text-primary-500" />
              Property Bookings ({bookings.length})
            </h2>
          </div>
          
          {bookingsLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">
              <FaCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No booking requests yet</h3>
              <p className="text-gray-500">
                When renters book your properties, their requests will appear here.
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    whileHover={{ y: -2 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Property Info */}
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {booking.property?.images?.[0] ? (
                              <img
                                src={booking.property.images[0]?.filename ? getImageUrl(booking.property.images[0].filename) : '/placeholder-property.svg'}
                                alt={booking.property.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FaHome />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">
                              {booking.property?.title || 'Property Title'}
                            </h4>
                            <div className="flex items-center text-gray-600 mb-2">
                              <FaMapMarkerAlt className="text-primary-500 mr-2" />
                              <span>{booking.property?.location || 'Location'}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FaCalendar className="mr-1" />
                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                              </span>
                              <span className="flex items-center">
                                ₹{booking.property?.price?.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end space-y-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                        
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'accepted')}
                              className="px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleBookingStatusUpdate(booking._id, 'rejected')}
                              className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* User Information */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h5 className="font-medium text-gray-900 mb-2">Renter Information</h5>
                      <div className="text-sm text-gray-600">
                        <p><span className="font-medium">Name:</span> {booking.user?.name || 'N/A'}</p>
                        <p><span className="font-medium">Email:</span> {booking.user?.email || 'N/A'}</p>
                        {booking.message && (
                          <p className="mt-2">
                            <span className="font-medium">Message:</span> {booking.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
