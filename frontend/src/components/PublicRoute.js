import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;
