import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ConditionalRoute = ({ children }) => {
  const { isAuthenticated, isOwner, isRenter } = useAuth();

  // If user is authenticated, redirect to appropriate dashboard based on role
  if (isAuthenticated) {
    if (isOwner()) {
      return <Navigate to="/owner-dashboard" replace />;
    } else if (isRenter()) {
      return <Navigate to="/renter-dashboard" replace />;
    }
  }

  // Otherwise, show the regular home page
  return children;
};

export default ConditionalRoute;
