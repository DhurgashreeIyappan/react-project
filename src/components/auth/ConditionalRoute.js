import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ConditionalRoute = ({ children }) => {
  const { user, isAuthenticated, isRenter } = useAuth();

  // If user is authenticated and is a renter, redirect to renter dashboard
  if (isAuthenticated && isRenter()) {
    return <Navigate to="/renter-dashboard" replace />;
  }

  // Otherwise, show the regular home page
  return children;
};

export default ConditionalRoute;
