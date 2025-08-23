import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';
import toast from 'react-hot-toast';

const PropertyContext = createContext();

// Mock data for development/demo purposes
const mockProperties = [
  {
    _id: '1',
    title: 'Modern Downtown Apartment',
    description: 'Beautiful 2-bedroom apartment in the heart of downtown with stunning city views.',
    price: 2500,
    location: 'Downtown, City Center',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    size: 1200,
    furnished: true,
    petFriendly: true,
    amenities: ['Gym', 'Pool', 'Parking', 'Balcony'],
    images: [
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Living+Room',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Kitchen',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Bedroom',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Bathroom',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Balcony'
    ],
    rating: 4.5,
    reviews: 12,
    owner: { name: 'John Smith', email: 'john@example.com' },
    availabilityDate: '2024-01-15',
    createdAt: '2024-01-01'
  },
  {
    _id: '2',
    title: 'Cozy Studio Near University',
    description: 'Perfect studio apartment for students, fully furnished with modern amenities.',
    price: 1200,
    location: 'University District',
    type: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    size: 500,
    furnished: true,
    petFriendly: false,
    amenities: ['WiFi', 'Kitchen', 'Laundry'],
    images: [
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Studio+Space',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Kitchen+Area',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Bathroom',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Study+Corner'
    ],
    rating: 4.2,
    reviews: 8,
    owner: { name: 'Sarah Johnson', email: 'sarah@example.com' },
    availabilityDate: '2024-01-20',
    createdAt: '2024-01-02'
  },
  {
    _id: '3',
    title: 'Luxury Villa with Pool',
    description: 'Spacious 4-bedroom villa with private pool, garden, and mountain views.',
    price: 4500,
    location: 'Hillside, Suburbs',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 3,
    size: 2800,
    furnished: true,
    petFriendly: true,
    amenities: ['Pool', 'Garden', 'Mountain View', 'Security', 'Garage'],
    images: [
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Exterior',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Pool+Area',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Living+Room',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Master+Bedroom',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Garden'
    ],
    rating: 4.8,
    reviews: 25,
    owner: { name: 'Michael Brown', email: 'michael@example.com' },
    availabilityDate: '2024-02-01',
    createdAt: '2024-01-03'
  },
  {
    _id: '4',
    title: 'Charming Townhouse',
    description: 'Beautiful 3-bedroom townhouse in a quiet neighborhood with backyard.',
    price: 3200,
    location: 'Residential Area',
    type: 'townhouse',
    bedrooms: 3,
    bathrooms: 2.5,
    size: 1800,
    furnished: false,
    petFriendly: true,
    amenities: ['Backyard', 'Fireplace', 'Basement', 'Patio'],
    images: [
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Front+View',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Living+Room',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Kitchen',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Backyard'
    ],
    rating: 4.3,
    reviews: 15,
    owner: { name: 'Emily Davis', email: 'emily@example.com' },
    availabilityDate: '2024-01-25',
    createdAt: '2024-01-04'
  },
  {
    _id: '5',
    title: 'Modern Loft in Arts District',
    description: 'Industrial-style loft with high ceilings and artistic atmosphere.',
    price: 2800,
    location: 'Arts District',
    type: 'loft',
    bedrooms: 1,
    bathrooms: 1,
    size: 900,
    furnished: true,
    petFriendly: true,
    amenities: ['High Ceilings', 'Exposed Brick', 'Art Studio', 'Rooftop Access'],
    images: [
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Main+Space',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Kitchen',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Art+Studio',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Rooftop'
    ],
    rating: 4.6,
    reviews: 18,
    owner: { name: 'David Wilson', email: 'david@example.com' },
    availabilityDate: '2024-01-30',
    createdAt: '2024-01-05'
  },
  {
    _id: '6',
    title: 'Family Home with Garden',
    description: 'Spacious family home with large garden, perfect for families with children.',
    price: 3800,
    location: 'Family Neighborhood',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    size: 2200,
    furnished: false,
    petFriendly: true,
    amenities: ['Large Garden', 'Playground', 'Storage', 'Workshop'],
    images: [
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Exterior',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Living+Room',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Kitchen',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Garden',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Playground'
    ],
    rating: 4.7,
    reviews: 22,
    owner: { name: 'Lisa Anderson', email: 'lisa@example.com' },
    availabilityDate: '2024-02-05',
    createdAt: '2024-01-06'
  },
  {
    _id: '7',
    title: 'Seaside Condo with Ocean View',
    description: 'Luxurious 2-bedroom condo with breathtaking ocean views and beach access.',
    price: 5200,
    location: 'Beachfront, Coastal Area',
    type: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    size: 1400,
    furnished: true,
    petFriendly: false,
    amenities: ['Ocean View', 'Beach Access', 'Fitness Center', 'Pool', 'Parking'],
    images: [
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Ocean+View',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Living+Room',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Kitchen',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Bedroom',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Balcony'
    ],
    rating: 4.9,
    reviews: 31,
    owner: { name: 'Robert Chen', email: 'robert@example.com' },
    availabilityDate: '2024-02-10',
    createdAt: '2024-01-07'
  },
  {
    _id: '8',
    title: 'Urban Penthouse Suite',
    description: 'Exclusive penthouse with panoramic city views and luxury amenities.',
    price: 6800,
    location: 'City Center, Downtown',
    type: 'penthouse',
    bedrooms: 3,
    bathrooms: 3.5,
    size: 3200,
    furnished: true,
    petFriendly: true,
    amenities: ['City View', 'Private Terrace', 'Concierge', 'Gym', 'Spa'],
    images: [
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=City+View',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Living+Area',
      'https://via.placeholder.com/400x300/D97706/FFFFFF?text=Kitchen',
      'https://via.placeholder.com/400x300/0F766E/FFFFFF?text=Master+Suite',
      'https://via.placeholder.com/400x300/059669/FFFFFF?text=Terrace'
    ],
    rating: 4.8,
    reviews: 28,
    owner: { name: 'Jennifer Lee', email: 'jennifer@example.com' },
    availabilityDate: '2024-02-15',
    createdAt: '2024-01-08'
  }
];

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
    bedroomsMin: '',
    bathroomsMin: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProperties = async (page = 1, searchFilters = {}) => {
    setLoading(true);
    try {
      const params = { page, ...searchFilters, q: searchFilters.q || searchQuery };
      const res = await client.get('/properties', { params });
      setProperties(res.data.properties);
      setFilteredProperties(res.data.properties);
      setTotalPages(res.data.totalPages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const searchProperties = async (query) => {
    // Only update query; filtering happens via applyFilters effect
    setSearchQuery(query);
  };

  const applyFilters = async () => {
    try {
      // Start from current properties (including added ones). If empty, fall back to mock.
      let base = properties && properties.length > 0 ? [...properties] : [...mockProperties];

      // Apply search query
      const normalizedQuery = (searchQuery || '').toLowerCase().trim();
      if (normalizedQuery) {
        base = base.filter(p =>
          (p.title || '').toLowerCase().includes(normalizedQuery) ||
          (p.description || '').toLowerCase().includes(normalizedQuery) ||
          (p.location || '').toLowerCase().includes(normalizedQuery)
        );
      }

      // Apply active filters
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      );

      let filtered = [...base];

      if (activeFilters.location) {
        filtered = filtered.filter(p =>
          (p.location || '').toLowerCase().includes(activeFilters.location.toLowerCase())
        );
      }

      if (activeFilters.priceMin) {
        filtered = filtered.filter(p => (p.price || 0) >= parseInt(activeFilters.priceMin));
      }

      if (activeFilters.priceMax) {
        filtered = filtered.filter(p => (p.price || 0) <= parseInt(activeFilters.priceMax));
      }

      if (activeFilters.propertyType) {
        filtered = filtered.filter(p => p.type === activeFilters.propertyType);
      }

      if (activeFilters.furnished !== undefined && activeFilters.furnished !== '') {
        filtered = filtered.filter(p => !!p.furnished === (activeFilters.furnished === 'true'));
      }

      if (activeFilters.petFriendly !== undefined && activeFilters.petFriendly !== '') {
        filtered = filtered.filter(p => !!p.petFriendly === (activeFilters.petFriendly === 'true'));
      }

      if (activeFilters.bedroomsMin) {
        filtered = filtered.filter(p => (p.bedrooms || 0) >= parseInt(activeFilters.bedroomsMin));
      }

      if (activeFilters.bathroomsMin) {
        filtered = filtered.filter(p => (p.bathrooms || 0) >= parseFloat(activeFilters.bathroomsMin));
      }

      setFilteredProperties(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      toast.error('Failed to apply filters');
    }
  };

  const addProperty = async (propertyData) => {
    try {
      const res = await client.post('/properties', propertyData);
      setProperties(prev => [res.data.property, ...prev]);
      setFilteredProperties(prev => [res.data.property, ...prev]);
      toast.success('Property added successfully!');
      return { success: true, property: res.data.property };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add property';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      const res = await client.put(`/properties/${id}`, propertyData);
      const updatedProperty = res.data.property;
      setProperties(prev => prev.map(prop => prop._id === id ? updatedProperty : prop));
      setFilteredProperties(prev => prev.map(prop => prop._id === id ? updatedProperty : prop));
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
      await client.delete(`/properties/${id}`);
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
      const res = await client.get(`/properties/${id}`);
      return res.data.property;
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Failed to fetch property details');
      return null;
    }
  };

  const getUserProperties = async () => {
    try {
      const res = await client.get('/properties/me/list');
      return res.data.properties;
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
      bedroomsMin: '',
      bathroomsMin: '',
    });
    setFilteredProperties(properties);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchQuery, properties]);

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
