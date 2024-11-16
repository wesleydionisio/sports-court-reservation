   // frontend/src/utils/api.js
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:5005',
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Adicione um interceptor para incluir o token em todas as requisições
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem('token');
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });

   export default api;