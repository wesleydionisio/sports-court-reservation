// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = (userData) => {
    if (userData && userData.token) {
      try {
        const decoded = jwtDecode(userData.token);
        setUser({
          id: userData._id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          token: userData.token
        });
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        loadUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/login', {
        email,
        password
      });
      
      const userData = response.data;
      
      if (userData && userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        loadUser(userData);
        return { success: true };
      } else {
        throw new Error('Dados de usuário inválidos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer login'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/register', {
        name,
        email,
        password
      });
      
      const userData = response.data;
      
      if (userData && userData.token) {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        loadUser(userData);
        return { success: true };
      } else {
        throw new Error('Dados de usuário inválidos');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erro ao fazer registro'
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      register, 
      loading 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};