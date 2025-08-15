import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from './PropertyCard';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaHeart, FaTimes, FaPlus, FaUpload } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyList = () => {
  const location = useLocation();
  const { user, isAuthenticated, isOwner, isRenter } = useAuth();
  const { 
    properties,
    filteredProperties, 
    loading, 
    filters, 
    setFilters, 
    searchProperties, 
    clearFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    addProperty
  } = useProperty();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'apartment',
    bedrooms: '',
    bathrooms: '',
    size: '',
    furnished: false,
    petFriendly: false,
    images: []
  });

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

  // Debug: Log properties and authentication state
  useEffect(() => {
    console.log('PropertyList Debug:', {
      isAuthenticated,
      isOwner: isOwner(),
      isRenter: isRenter(),
      propertiesCount: properties?.length || 0,
      filteredPropertiesCount: filteredProperties?.length || 0,
      loading
    });
  }, [isAuthenticated, properties, filteredProperties, loading]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProperty(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = () => {
    // For now, add placeholder images
    const placeholderImages = [
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Image+1',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Image+2',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Image+3',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Image+4',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Image+5'
    ];
    setNewProperty(prev => ({ ...prev, images: placeholderImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await addProperty(newProperty);
      if (result.success) {
        setNewProperty({
          title: '',
          description: '',
          price: '',
          location: '',
          type: 'apartment',
          bedrooms: '',
          bathrooms: '',
          size: '',
          furnished: false,
          petFriendly: false,
          images: []
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding property:', error);
    }
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
         <div className="min-h-screen bg-surfaceAlt py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Find Your Perfect Home</h1>
          <p className="text-text-secondary">Discover amazing rental properties in your favorite locations</p>
        </div>

        {/* Add Property Form for Property Owners */}
        {isAuthenticated && isOwner() && (
          <div className="bg-surface rounded-2xl shadow-lg border border-border p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Add New Property</h2>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
              >
                <FaPlus />
                <span>{showAddForm ? 'Hide Form' : 'Add Property'}</span>
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                                             <label className="block text-sm font-medium text-text-primary mb-2">Property Title</label>
                      <input
                        type="text"
                        name="title"
                        value={newProperty.title}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Enter property title"
                      />
                    </div>

                                         <div>
                       <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
                       <input
                         type="text"
                         name="location"
                         value={newProperty.location}
                         onChange={handleInputChange}
                         required
                         className="input-field"
                         placeholder="Enter location"
                       />
                     </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Price (per month)</label>
                      <input
                        type="number"
                        name="price"
                        value={newProperty.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="input-field"
                        placeholder="Enter monthly rent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Property Type</label>
                      <select
                        name="type"
                        value={newProperty.type}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="villa">Villa</option>
                        <option value="studio">Studio</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="loft">Loft</option>
                        <option value="penthouse">Penthouse</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Bedrooms</label>
                      <input
                        type="number"
                        name="bedrooms"
                        value={newProperty.bedrooms}
                        onChange={handleInputChange}
                        min="0"
                        className="input-field"
                        placeholder="Number of bedrooms"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Bathrooms</label>
                      <input
                        type="number"
                        name="bathrooms"
                        value={newProperty.bathrooms}
                        onChange={handleInputChange}
                        min="0"
                        step="0.5"
                        className="input-field"
                        placeholder="Number of bathrooms"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Size (sqft)</label>
                      <input
                        type="number"
                        name="size"
                        value={newProperty.size}
                        onChange={handleInputChange}
                        min="0"
                        className="input-field"
                        placeholder="Property size in sqft"
                      />
                    </div>

                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="furnished"
                          checked={newProperty.furnished}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                                                 <span className="text-sm font-medium text-text-primary">Furnished</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="petFriendly"
                          checked={newProperty.petFriendly}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                                                 <span className="text-sm font-medium text-text-primary">Pet Friendly</span>
                      </label>
                    </div>
                  </div>

                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                    <textarea
                      name="description"
                      value={newProperty.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="input-field"
                      placeholder="Describe your property..."
                    />
                  </div>

                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Images</label>
                                         <button
                       type="button"
                       onClick={handleImageUpload}
                       className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg hover:bg-surfaceAlt transition-colors duration-200"
                     >
                       <FaUpload />
                       <span>Add 5 Placeholder Images</span>
                     </button>
                    {newProperty.images.length > 0 && (
                                             <div className="mt-2 text-sm text-text-secondary">
                         {newProperty.images.length} images added
                       </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-4">
                                         <button
                       type="button"
                       onClick={() => setShowAddForm(false)}
                       className="px-6 py-2 border border-border rounded-lg text-text-secondary hover:bg-surfaceAlt transition-colors duration-200"
                     >
                       Cancel
                     </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      Add Property
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Search and Filters Bar */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                                     className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </form>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                                 className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
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
                                 className="mt-6 pt-6 border-t border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Location */}
                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Location</label>
                                         <input
                       type="text"
                       placeholder="City, State"
                       value={filters.location}
                       onChange={(e) => handleFilterChange('location', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     />
                  </div>

                  {/* Price Range */}
                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Min Price</label>
                                         <input
                       type="number"
                       placeholder="Min"
                       value={filters.priceMin}
                       onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     />
                  </div>

                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Max Price</label>
                                         <input
                       type="number"
                       placeholder="Max"
                       value={filters.priceMax}
                       onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     />
                  </div>

                  {/* Property Type */}
                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Property Type</label>
                                         <select
                       value={filters.propertyType}
                       onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     >
                      <option value="">All Types</option>
                      {propertyTypes.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Furnished Status */}
                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Furnished</label>
                                         <select
                       value={filters.furnished}
                       onChange={(e) => handleFilterChange('furnished', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     >
                      <option value="">Any</option>
                      {furnishedOptions.map(option => (
                        <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Pet Friendly */}
                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Pet Friendly</label>
                                         <select
                       value={filters.petFriendly}
                       onChange={(e) => handleFilterChange('petFriendly', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     >
                      <option value="">Any</option>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>

                  {/* Availability Date */}
                  <div>
                                         <label className="block text-sm font-medium text-text-primary mb-2">Available From</label>
                                         <input
                       type="date"
                       value={filters.availabilityDate}
                       onChange={(e) => handleFilterChange('availabilityDate', e.target.value)}
                       className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                     />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex justify-between items-center mt-4">
                                     <button
                     onClick={clearFilters}
                     className="flex items-center space-x-2 text-text-secondary hover:text-primary transition-colors duration-200"
                   >
                     <FaTimes />
                     <span>Clear All Filters</span>
                   </button>
                  
                                     <div className="text-sm text-text-muted">
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
            {searchQuery.trim() && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-primary">
                    Search Results for "{searchQuery}"
                  </h2>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchProperties('');
                    }}
                    className="text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                </div>
                
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-6xl text-text-muted mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-text-secondary mb-2">No properties found</h3>
                <p className="text-text-muted">Try adjusting your search criteria or browse our featured properties below</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property._id} property={property} showLink={true} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Featured Properties Section */}
            <div className="mb-12">
              <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-text-primary mb-4">Featured Properties</h2>
            <p className="text-lg text-text-secondary">Discover our handpicked selection of premium rental properties</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.slice(0, 6).map((property) => (
                  <PropertyCard key={property._id} property={property} showLink={true} />
                ))}
              </div>
            </div>

            {/* All Properties Grid (for logged in users) */}
            {isAuthenticated && !searchQuery.trim() && (
              <>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">All Properties</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedProperties.map((property) => (
                    <PropertyCard key={property._id} property={property} showLink={true} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex space-x-2">
                                             <button
                         onClick={() => setCurrentPage(currentPage - 1)}
                         disabled={currentPage === 1}
                         className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surfaceAlt transition-colors duration-200"
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
                               : 'border border-border hover:bg-surfaceAlt'
                           }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                                             <button
                         onClick={() => setCurrentPage(currentPage + 1)}
                         disabled={currentPage === totalPages}
                         className="px-4 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surfaceAlt transition-colors duration-200"
                       >
                         Next
                       </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Login Prompt for non-authenticated users */}
            {!isAuthenticated && !searchQuery.trim() && (
              <div className="text-center mt-8">
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  Login to See All Properties
                </Link>
              </div>
            )}
          </>
        )}
       </div>
     </div>
   );
 };



export default PropertyList;
