import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import client, { setAuthToken } from '../api/client';
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
    setAuthToken(token);
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
      const res = await client.post('/auth/login', { email, password });
      console.log('Login API response:', res.status, res.data);
      const { success, token: jwt, user: profile, message } = res.data;
      if (success === false) {
        const msg = message || 'Invalid credentials';
        toast.error(msg);
        return { success: false, message: msg };
      }
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setAuthToken(jwt);
      setUser(profile);
      toast.success('Login successful');
      return { success: true };
    } catch (error) {
      console.log('Login API error:', error?.response?.status, error?.response?.data);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await client.post('/auth/register', userData);
      const { token: jwt, user: profile } = res.data;
      localStorage.setItem('token', jwt);
      setToken(jwt);
      setAuthToken(jwt);
      setUser(profile);
      toast.success('Registration successful');
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
    setAuthToken(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await client.put('/users/me', profileData);
      setUser(res.data.user);
      toast.success('Profile updated successfully');
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
