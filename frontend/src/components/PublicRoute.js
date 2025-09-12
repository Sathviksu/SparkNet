import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  // If coming from signup, allow access to the route (login page)
  if (location.state?.fromSignup) {
    return children;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

export default PublicRoute;
