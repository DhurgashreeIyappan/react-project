import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { FaSearch, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Home = () => {
  const { properties, loading } = useProperty();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() || searchLocation.trim()) {
      navigate('/properties', { 
        state: { 
          search: searchQuery, 
          location: searchLocation 
        } 
      });
    }
  };

  const featuredProperties = properties.slice(0, 6);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-accent min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-bounce-gentle"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-bounce-gentle" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-accent">Rental Home</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover amazing properties in your favorite locations. From cozy apartments to luxury villas, 
              we have the perfect place for you.
            </p>
          </motion.div>

          {/* Glassmorphism Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <form onSubmit={handleSearch} className="glassmorphism rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300"
                  />
                </div>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 rounded-lg border-0 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-300"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Search Properties
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Curved Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-auto">
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="#F7F8FC"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="#F7F8FC"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="#F7F8FC"
            />
          </svg>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium rental properties in prime locations
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredProperties.map((property) => (
                <motion.div
                  key={property._id}
                  variants={itemVariants}
                  className="group"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              to="/properties"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View All Properties
              <FaSearch className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RentEase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We make finding and managing rental properties simple and enjoyable
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaSearch className="text-4xl" />,
                title: 'Smart Search',
                description: 'Advanced filters and AI-powered recommendations to find your perfect match'
              },
              {
                icon: <FaHeart className="text-4xl" />,
                title: 'Trusted Listings',
                description: 'All properties are verified and managed by trusted property owners'
              },
              {
                icon: <FaStar className="text-4xl" />,
                title: 'Premium Experience',
                description: 'Seamless booking process with 24/7 customer support'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
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
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=Property+Image'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
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

        {/* Rating */}
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
    </motion.div>
  );
};

export default Home;
