import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { FaHome, FaEdit, FaTrash, FaEye, FaPlus, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const MyProperties = () => {
  const { getUserProperties, deleteProperty } = useProperty();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async () => {
    try {
      const userProperties = await getUserProperties();
      setProperties(userProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  }, [getUserProperties]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const result = await deleteProperty(propertyId);
        if (result.success) {
          fetchProperties(); // Refresh the list
        }
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
          <p className="text-gray-600">Manage your rental property listings</p>
        </motion.div>

        {/* Add Property Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-8"
        >
          <Link
            to="/add-property"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <FaPlus className="mr-2" />
            Add New Property
          </Link>
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
              className="btn-primary"
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
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property, onDelete, index }) => {
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
          src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=Property+Image'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${property.price}/month
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4 flex items-center">
          <FaMapMarkerAlt className="text-primary mr-2" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 text-gray-500">
            <span className="flex items-center">
              <FaHome className="mr-1" />
              {property.bedrooms || 'N/A'} BR
            </span>
            <span className="flex items-center">
              <FaHome className="mr-1" />
              {property.bathrooms || 'N/A'} BA
            </span>
            <span className="flex items-center">
              <FaHome className="mr-1" />
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
            {property.propertyType || 'Property'}
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
