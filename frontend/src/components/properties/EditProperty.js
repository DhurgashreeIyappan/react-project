import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaBed, FaBath, FaRulerCombined, FaUpload, FaTimes, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import client from '../../api/client';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOwner } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    furnished: '',
    petFriendly: false,
    amenities: [],
    availabilityDate: '',
  });
  
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchProperty = useCallback(async () => {
    try {
      const response = await client.get(`/properties/${id}`);
      const propertyData = response.data.property;
      
      if (propertyData) {
        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          price: propertyData.price || '',
          location: propertyData.location || '',
          propertyType: propertyData.propertyType || propertyData.type || '',
          bedrooms: propertyData.bedrooms || '',
          bathrooms: propertyData.bathrooms || '',
          size: propertyData.size || '',
          furnished: propertyData.furnished || '',
          petFriendly: propertyData.petFriendly || false,
          amenities: propertyData.amenities || [],
          availabilityDate: propertyData.availabilityDate ? propertyData.availabilityDate.split('T')[0] : '',
        });
        
        // Set existing images
        if (propertyData.images && propertyData.images.length > 0) {
          setExistingImages(propertyData.images);
        }
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to fetch property details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Check if user is owner before fetching property
    if (!isOwner()) {
      navigate('/');
      return;
    }
    fetchProperty();
  }, [id, isOwner, navigate, fetchProperty]);

  const propertyTypes = ['apartment', 'villa', 'studio', 'house', 'condo', 'townhouse'];
  const furnishedOptions = ['furnished', 'unfurnished', 'partially-furnished'];
  const amenitiesList = [
    'WiFi', 'Air Conditioning', 'Heating', 'Dishwasher', 'Washing Machine',
    'Dryer', 'Parking', 'Gym', 'Pool', 'Garden', 'Balcony', 'Elevator',
    'Security System', 'Furnished Kitchen', 'Walk-in Closet'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 200 * 1024 * 1024; // 200MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 200MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image type.`);
        return false;
      }
      return true;
    });

    if (validFiles.length + newImages.length > 5) {
      toast.error('Maximum 5 new images allowed.');
      return;
    }

    setNewImages(prev => [...prev, ...validFiles]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Property title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Property description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }

    if (!formData.bedrooms) {
      newErrors.bedrooms = 'Number of bedrooms is required';
    } else if (isNaN(formData.bedrooms) || formData.bedrooms < 0) {
      newErrors.bedrooms = 'Please enter a valid number of bedrooms';
    }

    if (!formData.bathrooms) {
      newErrors.bathrooms = 'Number of bathrooms is required';
    } else if (isNaN(formData.bathrooms) || formData.bathrooms < 0) {
      newErrors.bathrooms = 'Please enter a valid number of bathrooms';
    }

    if (!formData.size) {
      newErrors.size = 'Property size is required';
    } else if (isNaN(formData.size) || formData.size <= 0) {
      newErrors.size = 'Please enter a valid property size';
    }

    if (!formData.furnished) {
      newErrors.furnished = 'Furnished status is required';
    }

    if (existingImages.length === 0 && newImages.length === 0) {
      newErrors.images = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        if (key === 'amenities') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (key === 'availabilityDate' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else if (key !== 'availabilityDate') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add new images
      newImages.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      const response = await client.put(`/properties/${id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.property) {
        toast.success('Property updated successfully!');
        navigate('/owner-dashboard');
      }
    } catch (error) {
      console.error('Update property error:', error);
      const message = error.response?.data?.message || 'Failed to update property';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const getImageUrl = (image) => {
    if (image && image.filename) {
      return `http://localhost:5000/api/images/${image.filename}`;
    }
    return '/placeholder-property.svg';
  };

  // Check if user is owner before rendering
  if (!isOwner()) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Property</h1>
          <p className="text-gray-600">Update your property listing information</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaHome className="mr-2 text-primary" />
                Basic Information
              </h3>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., Beautiful 2BR Apartment in Downtown"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Describe your property, its features, and what makes it special..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Rent ($) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="1500"
                  min="0"
                  step="0.01"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="City, State, ZIP"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Property Details */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaRulerCombined className="mr-2 text-primary" />
                Property Details
              </h3>
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.propertyType ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select Property Type</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {errors.propertyType && (
                <p className="mt-1 text-sm text-red-600">{errors.propertyType}</p>
              )}
            </div>

            {/* Furnished Status */}
            <div>
              <label htmlFor="furnished" className="block text-sm font-medium text-gray-700 mb-2">
                Furnished Status *
              </label>
              <select
                id="furnished"
                name="furnished"
                value={formData.furnished}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.furnished ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Select Status</option>
                {furnishedOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </select>
              {errors.furnished && (
                <p className="mt-1 text-sm text-red-600">{errors.furnished}</p>
              )}
            </div>

            {/* Bedrooms */}
            <div>
              <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBed className="text-gray-400" />
                </div>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.bedrooms ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="2"
                  min="0"
                />
              </div>
              {errors.bedrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bedrooms}</p>
              )}
            </div>

            {/* Bathrooms */}
            <div>
              <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBath className="text-gray-400" />
                </div>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.bathrooms ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="1"
                  min="0"
                  step="0.5"
                />
              </div>
              {errors.bathrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bathrooms}</p>
              )}
            </div>

            {/* Size */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                Size (sq ft) *
              </label>
              <input
                id="size"
                name="size"
                type="number"
                value={formData.size}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${errors.size ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="800"
                min="0"
              />
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size}</p>
              )}
            </div>

            {/* Availability Date */}
            <div>
              <label htmlFor="availabilityDate" className="block text-sm font-medium text-gray-700 mb-2">
                Available From
              </label>
              <input
                id="availabilityDate"
                name="availabilityDate"
                type="date"
                value={formData.availabilityDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Pet Friendly */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="petFriendly"
                  checked={formData.petFriendly}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm font-medium text-gray-700">Pet Friendly</span>
              </label>
            </div>

            {/* Amenities */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={getImageUrl(image)}
                        alt={`Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                                                 onError={(e) => {
                           e.target.src = '/placeholder-property.svg';
                         }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Add New Images (Up to 200MB each)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Click to upload images or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, WEBP, GIF up to 200MB each. Max 5 new images.
                  </p>
                </label>
              </div>
              
              {newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New Property ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.images && (
                <p className="mt-1 text-sm text-red-600">{errors.images}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/owner-dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Updating Property...</span>
                </div>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Update Property
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default EditProperty;
