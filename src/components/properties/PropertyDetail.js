import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaStar, FaHeart, FaCalendar, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';

const PropertyDetail = () => {
  const { id } = useParams();
  const { getPropertyById } = useProperty();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      const propertyData = await getPropertyById(id);
      setProperty(propertyData);
      setLoading(false);
    };
    fetchProperty();
  }, [id, getPropertyById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Property Images */}
          <div className="relative h-96 bg-gray-200">
            {property.images && property.images.length > 0 ? (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <FaUser className="text-6xl" />
              </div>
            )}
            
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
            >
              <FaHeart className={`text-xl ${isLiked ? 'text-red-500' : 'text-gray-400'}`} />
            </button>
          </div>

          <div className="p-8">
            {/* Property Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <FaMapMarkerAlt className="text-primary mr-2" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-primary">${property.price}/month</div>
                <div className="flex items-center space-x-1">
                  <FaStar className="text-yellow-400" />
                  <span className="text-gray-600 font-medium">
                    {property.rating ? property.rating.toFixed(1) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaBed className="text-white text-xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.bedrooms || 'N/A'}</div>
                <div className="text-gray-600">Bedrooms</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaBath className="text-white text-xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.bathrooms || 'N/A'}</div>
                <div className="text-gray-600">Bathrooms</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaRulerCombined className="text-white text-xl" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{property.size || 'N/A'}</div>
                <div className="text-gray-600">sq ft</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaCalendar className="text-white text-xl" />
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {property.availabilityDate ? new Date(property.availabilityDate).toLocaleDateString() : 'Now'}
                </div>
                <div className="text-gray-600">Available</div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
                
                {property.amenities && property.amenities.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-gray-600">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Property Info Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{property.propertyType}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furnished:</span>
                      <span className="font-medium capitalize">{property.furnished}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet Friendly:</span>
                      <span className="font-medium">{property.petFriendly ? 'Yes' : 'No'}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{property.location}</span>
                    </div>
                  </div>

                  <button className="w-full btn-primary mt-6">
                    Book This Property
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PropertyDetail;
