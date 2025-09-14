import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, FaStar, FaBed, FaBath, FaRulerCombined } from 'react-icons/fa';
import { motion } from 'framer-motion';
import client from '../../api/client';
import toast from 'react-hot-toast';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
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

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await client.delete(`/properties/${propertyId}`);
        toast.success('Property deleted successfully');
        fetchProperties(); // Refresh the list
      } catch (error) {
        console.error('Error deleting property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const getImageUrl = (image) => {
    if (image && image.filename) {
      return `http://localhost:5000/api/images/${image.filename}`;
    }
    return '/placeholder-property.svg';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-app-pattern py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
            <p className="text-gray-600">Manage your rental property listings</p>
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
        </motion.div>

        {/* Properties List */}
        {properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center py-20 bg-white rounded-2xl shadow-lg"
          >
            <div className="text-6xl text-gray-300 mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties listed yet</h3>
            <p className="text-gray-500 mb-6">Start earning by listing your first property</p>
            <Link
              to="/add-property"
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
            >
              <FaPlus className="mr-2" />
              List Your First Property
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property, index) => (
              <PropertyCard
                key={property._id}
                property={property}
                onDelete={handleDeleteProperty}
                index={index}
                getImageUrl={getImageUrl}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, onDelete, index, getImageUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(property.images?.[0])}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-property.svg';
          }}
        />
        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{property.price?.toLocaleString()}/month
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {property.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
                         <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors duration-300">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4 flex items-center">
                           <FaMapMarkerAlt className="text-primary-500 mr-2" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 text-gray-500">
            <span className="flex items-center">
              <FaBed className="mr-1" />
              {property.bedrooms || 'N/A'} BR
            </span>
            <span className="flex items-center">
              <FaBath className="mr-1" />
              {property.bathrooms || 'N/A'} BA
            </span>
            <span className="flex items-center">
              <FaRulerCombined className="mr-1" />
              {property.size || 'N/A'} sqft
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <FaStar className="text-yellow-400" />
            <span className="text-gray-600 font-medium">
              {property.rating ? property.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <span className="text-sm text-gray-500 capitalize">
            {property.propertyType || property.type || 'Property'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link
            to={`/properties/${property._id}`}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <FaEye className="mr-2" />
            View
          </Link>
          
          <Link
            to={`/edit-property/${property._id}`}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            <FaEdit className="mr-2" />
            Edit
          </Link>
          
          <button
            onClick={() => onDelete(property._id)}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MyProperties;
