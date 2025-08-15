import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expired
          logout();
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      // Mock login - accept any email/password combination
      // In a real app, this would validate against the backend
      const mockUser = {
        _id: 'user123',
        name: 'Demo User',
        email: email,
        phone: '+1 (555) 123-4567',
        role: 'owner', // Default to owner for demo
        bio: 'Demo user for testing purposes',
        profilePicture: null,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      toast.success('Login successful! (Demo Mode)');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration - create a new user
      const mockUser = {
        _id: 'user' + Date.now(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        bio: userData.bio || '',
        profilePicture: null,
        createdAt: new Date().toISOString()
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      setUser(mockUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      
      toast.success('Registration successful! (Demo Mode)');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      // Mock profile update
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      toast.success('Profile updated successfully! (Demo Mode)');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const isOwner = () => user?.role === 'owner';
  const isRenter = () => user?.role === 'renter';

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isOwner,
    isRenter,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
