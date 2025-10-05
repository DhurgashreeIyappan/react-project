import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDisplayStatus } from '../../utils/status';
import { Link } from 'react-router-dom';
import { 
  FaHeart, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined, 
  FaStar, 
  FaChevronLeft, 
  FaChevronRight,
  FaParking,
  FaWifi,
  FaSnowflake
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const PropertyCard = ({ property, showLink = true }) => {
  const { user, isOwner, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const getImageUrl = (image) => {
    if (image && image.filename) {
      return `http://localhost:5000/api/images/${image.filename}`;
    }
    return '/placeholder-property.svg';
  };

  const nextImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property.images && property.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = (e) => {
    e.target.src = '/placeholder-property.svg';
    setImageLoading(false);
  };

  const formatPrice = (price) => {
    if (!price) return '₹N/A';
    return `₹${price.toLocaleString()}`;
  };

  const getAmenities = () => {
    const amenities = [];
    if (property.parking) amenities.push({ icon: <FaParking />, label: 'Parking' });
    if (property.wifi) amenities.push({ icon: <FaWifi />, label: 'WiFi' });
    if (property.ac) amenities.push({ icon: <FaSnowflake />, label: 'AC' });
    return amenities.slice(0, 3); // Show max 3 amenities
  };

  const getStatus = () => getDisplayStatus(property, user, { perspective: isOwner && isOwner() ? 'owner' : 'renter' });

  const cardContent = (
    <>
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden bg-surface-alt">
        {/* Loading Skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 skeleton-image"></div>
        )}
        
        {/* Main Image */}
        <img
          src={getImageUrl(property.images?.[currentImageIndex])}
          alt={property.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoading ? 'opacity-0' : 'opacity-100'
          } group-hover:scale-110`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        
        {/* Navigation Arrows */}
        {property.images && property.images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:shadow-medium transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <FaChevronLeft className="text-text-secondary text-sm" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:shadow-medium transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <FaChevronRight className="text-text-secondary text-sm" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:shadow-medium transition-all duration-200"
        >
          <FaHeart className={`text-lg ${isLiked ? 'text-error' : 'text-text-muted'}`} />
        </motion.button>

        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-primary-600 to-secondary-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-medium">
          {formatPrice(property.price)}/month
        </div>

        {/* Status Badge - hide for logged-out users */}
        {isAuthenticated && (
          <div className="absolute top-3 right-3">
            {(() => { const s = getStatus(); return (
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${s.cls}`}>{s.label}</span>
            ); })()}
          </div>
        )}

        {/* Property Type Badge */}
        <div className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-sm text-text-primary px-3 py-1 rounded-lg text-xs font-medium">
          {property.type || 'Property'}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Title and Location */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors duration-300">
            {property.title}
          </h3>
          <p className="text-text-secondary flex items-center space-x-2">
            <FaMapMarkerAlt className="text-primary-500 flex-shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </p>
        </div>
        
        {/* Property Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 text-text-muted">
            <span className="flex items-center space-x-2">
              <FaBed className="text-primary-500" />
              <span className="text-sm font-medium">{property.bedrooms || 'N/A'}</span>
            </span>
            <span className="flex items-center space-x-2">
              <FaBath className="text-primary-500" />
              <span className="text-sm font-medium">{property.bathrooms || 'N/A'}</span>
            </span>
            <span className="flex items-center space-x-2">
              <FaRulerCombined className="text-primary-500" />
              <span className="text-sm font-medium">{property.size || 'N/A'} sqft</span>
            </span>
          </div>
        </div>

        {/* Amenities */}
        {getAmenities().length > 0 && (
          <div className="flex items-center space-x-4 mb-4">
            {getAmenities().map((amenity, index) => (
              <div key={index} className="flex items-center space-x-1 text-text-muted">
                {amenity.icon}
                <span className="text-xs">{amenity.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Rating and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FaStar className="text-accent-500" />
            <span className="text-text-secondary font-medium">
              {property.rating ? property.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          
          {showLink && (
            <Link
              to={`/properties/${property._id}`}
              className="btn-primary text-sm px-4 py-2"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="card-hover group cursor-pointer"
    >
      {cardContent}
    </motion.div>
  );
};

export default PropertyCard;
