import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaBed, FaBath } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../../api/client';

const PropertyList = () => {
  const location = useLocation();
  
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    propertyType: '',
    furnished: '',
    petFriendly: '',
    availabilityDate: '',
    bedroomsMin: '',
    bathroomsMin: ''
  });

  // Initialize search from navigation state
  useEffect(() => {
    if (location.state?.search) {
      setSearchQuery(location.state.search);
    }
    if (location.state?.location) {
      setFilters(prev => ({ ...prev, location: location.state.location }));
    }
  }, [location.state]);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await client.get('/properties');
      setProperties(response.data.properties);
      setFilteredProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.priceMin) {
      filtered = filtered.filter(property => property.price >= Number(filters.priceMin));
    }

    if (filters.priceMax) {
      filtered = filtered.filter(property => property.price <= Number(filters.priceMax));
    }

    if (filters.propertyType) {
      filtered = filtered.filter(property => 
        property.propertyType === filters.propertyType || property.type === filters.propertyType
      );
    }

    if (filters.furnished !== '') {
      filtered = filtered.filter(property => property.furnished === (filters.furnished === 'true'));
    }

    if (filters.petFriendly !== '') {
      filtered = filtered.filter(property => property.petFriendly === (filters.petFriendly === 'true'));
    }

    if (filters.availabilityDate) {
      filtered = filtered.filter(property => 
        property.availabilityDate && property.availabilityDate >= filters.availabilityDate
      );
    }

    if (filters.bedroomsMin) {
      filtered = filtered.filter(property => property.bedrooms >= Number(filters.bedroomsMin));
    }

    if (filters.bathroomsMin) {
      filtered = filtered.filter(property => property.bathrooms >= Number(filters.bathroomsMin));
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters]);

  // Apply filters when filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const sorted = [...filteredProperties].sort((a, b) => {
      switch (value) {
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
    setFilteredProperties(sorted);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      priceMin: '',
      priceMax: '',
      propertyType: '',
      furnished: '',
      petFriendly: '',
      availabilityDate: '',
      bedroomsMin: '',
      bathroomsMin: ''
    });
    setSearchQuery('');
  };

  const propertyTypes = ['apartment', 'villa', 'studio', 'house', 'condo', 'townhouse'];
  const hasActiveFilters = Object.values(filters).some((value) => value !== '') || searchQuery.trim();

  return (
    <div className="min-h-screen bg-background bg-app-pattern py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Home</h1>
          <p className="text-gray-600">Discover amazing rental properties in your favorite locations</p>
                  </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white rounded-lg hover:shadow-lg transition-all duration-300"
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
                      <option value="true">Yes</option>
                      <option value="false">No</option>
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

                  {/* Bedrooms (min) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
                                         <input
                       type="number"
                       placeholder="0"
                       value={filters.bedroomsMin}
                       min="0"
                       onChange={(e) => handleFilterChange('bedroomsMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     />
                  </div>

                  {/* Bathrooms (min) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
                                         <input
                       type="number"
                       placeholder="0"
                       step="0.5"
                       value={filters.bathroomsMin}
                       min="0"
                       onChange={(e) => handleFilterChange('bathroomsMin', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between items-center mt-4">
                                     <button
                     onClick={clearFilters}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors duration-200"
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

        {/* Properties Display */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Search Results Section */}
            {hasActiveFilters && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {searchQuery.trim() ? `Search Results for "${searchQuery}"` : 'Filtered Results'}
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-primary-500 hover:text-primary-400 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                </div>
                
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl text-gray-400 mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or browse our available properties below</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property._id} property={property} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Available Properties Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Properties</h2>
                <p className="text-lg text-gray-600">Discover our collection of premium rental properties</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.slice(0, 8).map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            </div>

            {/* Login Prompt for non-authenticated users */}
            {/* Removed due to removal of isAuthenticated import */}
          </>
        )}
       </div>
     </div>
   );
 };

// Property Card Component
const PropertyCard = ({ property }) => {
  const getImageUrl = (image) => {
    if (image && image.filename) {
      return `http://localhost:5000/api/images/${image.filename}`;
    }
    return '/placeholder-property.svg';
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        <img
          src={getImageUrl(property.images?.[0])}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-property.svg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Available
          </span>
        </div>
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <FaMapMarkerAlt className="mr-2 text-gray-400" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <FaBed className="mr-1" />
              {property.bedrooms || 0}
            </span>
            <span className="flex items-center">
              <FaBath className="mr-1" />
              {property.bathrooms || 0}
            </span>
          </div>
                         <span className="text-lg font-bold text-primary-500">
            ₹{property.price?.toLocaleString()}
          </span>
        </div>

        {/* Action Button */}
        <Link
          to={`/properties/${property._id}`}
          className="w-full bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
};

export default PropertyList;
