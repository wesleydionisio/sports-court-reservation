// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Importação correta de jwtDecode
import axios from 'axios';
// Remova a importação de 'api' se não estiver utilizando
// import api from '../utils/api'; // Verifique se este caminho está correto

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Função para carregar o usuário a partir do token armazenado
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Supondo que o token contenha 'id' e 'role'; ajuste conforme sua implementação
        setUser({ id: decoded.id, role: decoded.role, token });
      } catch (error) {
        console.error('Token inválido', error);
        setUser(null);
        localStorage.removeItem('token'); // Remove o token inválido
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      loadUser();
      return { success: true };
    } catch (error) {
      console.error('Erro no login', error);
      return { success: false, message: error.response?.data?.message || 'Erro no login' };
    }
  };

  // Função de registro
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5005/api/auth/register', { name, email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      loadUser();
      return { success: true };
    } catch (error) {
      console.error('Erro no registro', error);
      return { success: false, message: error.response?.data?.message || 'Erro no registro' };
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};