import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default AdminRoute; 