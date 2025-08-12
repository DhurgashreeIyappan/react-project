import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaHeart, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyList = () => {
  const location = useLocation();
  const { 
    filteredProperties, 
    loading, 
    filters, 
    setFilters, 
    searchProperties, 
    clearFilters,
    currentPage,
    totalPages,
    setCurrentPage
  } = useProperty();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Initialize search from navigation state
  useEffect(() => {
    if (location.state?.search) {
      setSearchQuery(location.state.search);
      searchProperties(location.state.search);
    }
    if (location.state?.location) {
      setFilters(prev => ({ ...prev, location: location.state.location }));
    }
  }, [location.state]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchProperties(searchQuery);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    // Apply sorting logic here
  };

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const propertyTypes = ['apartment', 'villa', 'studio', 'house', 'condo'];
  const furnishedOptions = ['furnished', 'unfurnished', 'partially-furnished'];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
          <p className="text-gray-600">Discover amazing rental properties in your favorite locations</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </form>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <FaFilter />
              <span>Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="City, State"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>

                  {/* Property Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={filters.propertyType}
                      onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">All Types</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Furnished Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Furnished</label>
                    <select
                      value={filters.furnished}
                      onChange={(e) => handleFilterChange('furnished', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Any</option>
                      {furnishedOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pet Friendly */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pet Friendly</label>
                    <select
                      value={filters.petFriendly}
                      onChange={(e) => handleFilterChange('petFriendly', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Any</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {/* Availability Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Available From</label>
                    <input
                      type="date"
                      value={filters.availabilityDate}
                      onChange={(e) => handleFilterChange('availabilityDate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={clearFilters}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    <FaTimes />
                    <span>Clear All Filters</span>
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    {filteredProperties.length} properties found
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl text-gray-300 mb-4">🏠</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Property Card Component
const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/properties/${property._id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=Property+Image'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <FaHeart className={`text-lg ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
          </button>
          <div className="absolute bottom-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
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
                <FaBed className="mr-1" />
                {property.bedrooms || 'N/A'}
              </span>
              <span className="flex items-center">
                <FaBath className="mr-1" />
                {property.bathrooms || 'N/A'}
              </span>
              <span className="flex items-center">
                <FaRulerCombined className="mr-1" />
                {property.size || 'N/A'} sqft
              </span>
            </div>
          </div>

          {/* Rating and Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <FaStar className="text-yellow-400" />
              <span className="text-gray-600 font-medium">
                {property.rating ? property.rating.toFixed(1) : 'N/A'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {property.propertyType || 'Property'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyList;
