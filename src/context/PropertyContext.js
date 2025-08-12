import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    propertyType: '',
    furnished: '',
    petFriendly: '',
    availabilityDate: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async (page = 1, searchFilters = {}) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        ...searchFilters,
      };
      
      const response = await axios.get('/api/properties', { params });
      const { properties: fetchedProperties, totalPages: total } = response.data;
      
      setProperties(fetchedProperties);
      setFilteredProperties(fetchedProperties);
      setTotalPages(total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredProperties(properties);
      return;
    }

    try {
      const response = await axios.get(`/api/properties/search?q=${encodeURIComponent(query)}`);
      setFilteredProperties(response.data.properties);
    } catch (error) {
      console.error('Error searching properties:', error);
      toast.error('Search failed');
    }
  };

  const applyFilters = async () => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== '')
    );
    
    if (Object.keys(activeFilters).length === 0) {
      setFilteredProperties(properties);
      return;
    }

    try {
      const response = await axios.get('/api/properties/filter', { params: activeFilters });
      setFilteredProperties(response.data.properties);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    }
  };

  const addProperty = async (propertyData) => {
    try {
      const response = await axios.post('/api/properties', propertyData);
      const newProperty = response.data.property;
      
      setProperties(prev => [newProperty, ...prev]);
      setFilteredProperties(prev => [newProperty, ...prev]);
      
      toast.success('Property added successfully!');
      return { success: true, property: newProperty };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add property';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const response = await axios.put(`/api/properties/${id}`, propertyData);
      const updatedProperty = response.data.property;
      
      setProperties(prev => 
        prev.map(prop => prop._id === id ? updatedProperty : prop)
      );
      setFilteredProperties(prev => 
        prev.map(prop => prop._id === id ? updatedProperty : prop)
      );
      
      toast.success('Property updated successfully!');
      return { success: true, property: updatedProperty };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update property';
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteProperty = async (id) => {
    try {
      await axios.delete(`/api/properties/${id}`);
      
      setProperties(prev => prev.filter(prop => prop._id !== id));
      setFilteredProperties(prev => prev.filter(prop => prop._id !== id));
      
      toast.success('Property deleted successfully!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete property';
      toast.error(message);
      return { success: false, message };
    }
  };

  const getPropertyById = async (id) => {
    try {
      const response = await axios.get(`/api/properties/${id}`);
      return response.data.property;
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to fetch property details');
      return null;
    }
  };

  const getUserProperties = async () => {
    try {
      const response = await axios.get('/api/properties/my-properties');
      return response.data.properties;
    } catch (error) {
      console.error('Error fetching user properties:', error);
      toast.error('Failed to fetch your properties');
      return [];
    }
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
    });
    setFilteredProperties(properties);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters]);

  const value = {
    properties,
    filteredProperties,
    loading,
    currentPage,
    totalPages,
    filters,
    searchQuery,
    setFilters,
    setSearchQuery,
    fetchProperties,
    searchProperties,
    applyFilters,
    clearFilters,
    addProperty,
    updateProperty,
    deleteProperty,
    getPropertyById,
    getUserProperties,
    setCurrentPage,
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};
