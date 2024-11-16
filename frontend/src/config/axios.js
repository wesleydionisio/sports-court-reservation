import axios from 'axios';

// Configuração base do axios
axios.defaults.baseURL = 'http://localhost:5005';

// Interceptor para adicionar token em todas as requisições
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios; 