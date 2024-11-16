// src/middlewares/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // Usuário não está autenticado
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin') {
    // Usuário não é administrador
    return <Navigate to="/" />;
  }

  // Usuário está autenticado e é administrador
  return children;
};

export default AdminRoute;