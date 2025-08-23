import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PropertyCard = ({ property, showLink = true }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const cardContent = (
    <>
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(property.images?.[currentImageIndex])}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/placeholder-property.svg';
          }}
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
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
              <FaChevronLeft className="text-text-secondary text-sm" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
              <FaChevronRight className="text-text-secondary text-sm" />
            </button>
          </>
        )}

        {/* Image Indicators */}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex space-x-1">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToImage(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
        >
          <FaHeart className={`text-lg ${isLiked ? 'text-error' : 'text-text-muted'}`} />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{property.price?.toLocaleString()}/month
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors duration-300">
          {property.title}
        </h3>
        <p className="text-text-secondary mb-4 flex items-center">
          <FaMapMarkerAlt className="text-primary mr-2" />
          {property.location}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4 text-text-muted">
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
            <FaStar className="text-accent" />
            <span className="text-text-secondary font-medium">
              {property.rating ? property.rating.toFixed(1) : 'N/A'}
            </span>
          </div>
          <span className="text-sm text-text-muted">
            {property.type || 'Property'}
          </span>
        </div>

        {showLink && (
          <div className="mt-4">
            <Link
              to={`/properties/${property._id}`}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
            >
              View Details
            </Link>
          </div>
        )}
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-surface rounded-2xl shadow-lg border border-border overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {cardContent}
    </motion.div>
  );
};

export default PropertyCard;
