import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
