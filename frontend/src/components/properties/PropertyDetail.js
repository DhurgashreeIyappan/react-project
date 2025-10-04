import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaHeart, FaCalendar, FaUser, FaEdit, FaChevronLeft, FaChevronRight, FaTrash, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import client from '../../api/client';
import { getDisplayStatus } from '../../utils/status';
import toast from 'react-hot-toast';

const PropertyDetail = () => {
  const { id } = useParams();
  const { user, isOwner, isRenter } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    message: ''
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  // Check if current user owns this property
  const isPropertyOwner = property && user && isOwner() && property.owner?._id === user.id;

  const getDetailStatus = () => getDisplayStatus(property, user, { perspective: isPropertyOwner ? 'owner' : 'renter' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await client.get(`/properties/${id}`);
        setProperty(response.data.property);
      } catch (error) {
        console.error('Error fetching property:', error);
        toast.error('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const getImageUrl = (image) => {
    if (image && image.filename) {
      return `http://localhost:5000/api/images/${image.filename}`;
    }
    return '/placeholder-property.svg';
  };

  const nextImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const handleDeleteProperty = async () => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await client.delete(`/properties/${property._id}`);
        toast.success('Property deleted successfully');
        // Redirect to my properties page
        window.location.href = '/my-properties';
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    
    try {
      await client.post('/bookings', {
        property: property._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        message: bookingData.message
      });
      
      toast.success('Booking request submitted successfully!');
      setShowBookingModal(false);
      setBookingData({ startDate: '', endDate: '', message: '' });
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast.error('Failed to submit booking request');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background bg-app-pattern flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background bg-app-pattern flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-app-pattern">
      {/* Hero Image Section */}
      <div className="relative bg-gray-200">
        {property.images && property.images.length > 0 ? (
          <>
            <div className="w-full flex items-center justify-center" style={{ maxHeight: '70vh' }}>
              <img
                src={getImageUrl(property.images[currentImageIndex])}
                alt={property.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
                onError={(e) => {
                  e.target.src = '/placeholder-property.svg';
                }}
              />
            </div>
            
            {/* Image Navigation */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg border border-gray-200"
                >
                  <FaChevronLeft className="text-gray-600 text-lg" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg border border-gray-200"
                >
                  <FaChevronRight className="text-gray-600 text-lg" />
                </button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-4 h-4 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full flex items-center justify-center" style={{ maxHeight: '70vh' }}>
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <FaUser className="text-8xl" />
            </div>
          </div>
        )}
        
        {/* Status Badge */}
          <div className="absolute top-6 left-6">
          {(() => { const s = getDetailStatus(); return (
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${s.cls}`}>{s.label}</span>
          ); })()}
          </div>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-6 right-6 w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 shadow-lg border border-gray-200"
        >
          <FaHeart className={`text-2xl ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Owner Actions */}
        {isPropertyOwner && (
          <div className="absolute top-6 left-6 flex space-x-3">
            <Link
              to={`/edit-property/${property._id}`}
              className="inline-flex items-center px-4 py-2 bg-white/90 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors duration-200 shadow-lg"
            >
              <FaEdit className="mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDeleteProperty}
              className="inline-flex items-center px-4 py-2 bg-red-500/90 text-white font-medium rounded-lg hover:bg-red-500 transition-colors duration-200 shadow-lg"
            >
              <FaTrash className="mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-5 mb-4"
            >
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="text-primary-500 mr-2 text-xl" />
                  <span className="text-lg">{property.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-primary-500">₹{property.price?.toLocaleString()}/month</div>
                  <div className="flex items-center space-x-2">
                    <FaStar className="text-yellow-400 text-xl" />
                    <span className="text-gray-600 font-medium text-lg">
                      {property.rating ? property.rating.toFixed(1) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaBed className="text-white text-2xl" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                  <div className="text-gray-600">Bedrooms</div>
                </div>
                
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaBath className="text-white text-2xl" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms || 'N/A'}</div>
                  <div className="text-gray-600">Bathrooms</div>
                </div>
                
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to紫urple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaRulerCombined className="text-white text-2xl" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{property.size || 'N/A'}</div>
                  <div className="text-gray-600">sq ft</div>
                </div>
                
                <div className="text-center p-4 bg-surface-alt rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FaCalendar className="text-white text-2xl" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {property.availabilityDate ? new Date(property.availabilityDate).toLocaleDateString() : 'Now'}
                  </div>
                  <div className="text-gray-600">Available</div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-5 mb-4"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Description</h3>
              <p className="text-gray-600 leading-relaxed text-base line-clamp-5">{property.description}</p>
            </motion.div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-5"
              >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.slice(0,6).map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-gray-700 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-5 sticky top-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Property Information</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold capitalize">{property.propertyType || property.type}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Furnished:</span>
                  <span className="font-semibold capitalize">{property.furnished ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Pet Friendly:</span>
                  <span className="font-semibold">{property.petFriendly ? 'Yes' : 'No'}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  {(() => { const s = getDetailStatus(); return (
                    <span className={`font-semibold px-3 py-1 rounded-full text-sm ${s.cls}`}>{s.label}</span>
                  ); })()}
                </div>

                {/* Owner Information */}
                {property.owner && (
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Property Owner</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <FaUser className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{property.owner.name}</p>
                        <p className="text-gray-600">{property.owner.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Button - Only show for renters who don't own this property and when Available */}
              {isRenter() && !isPropertyOwner && getDetailStatus().label === 'Available' && (
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 mt-6"
                >
                  Book This Property
                </button>
              )}

              {/* Owner Actions */}
              {isPropertyOwner && (
                <div className="mt-6 space-y-3">
                  <Link
                    to={`/edit-property/${property._id}`}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaEdit className="mr-2" />
                    Edit Property
                  </Link>
                  <button
                    onClick={handleDeleteProperty}
                    className="w-full bg-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300 flex items-center justify-center"
                  >
                    <FaTrash className="mr-2" />
                    Delete Property
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Book This Property</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={bookingData.startDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={bookingData.endDate}
                    onChange={handleInputChange}
                    required
                    min={bookingData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={bookingData.message}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Any special requests or additional information..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? 'Submitting...' : 'Submit Booking'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetail;
