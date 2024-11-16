   // frontend/src/utils/api.js
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:5005/api', // URL base correta do backend
     headers: {
       'Content-Type': 'application/json'
     }
   });

   // Interceptor para adicionar token automaticamente
   api.interceptors.request.use(
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

   // Interceptor para tratar erros de autenticação
   api.interceptors.response.use(
     (response) => response,
     (error) => {
       if (error.response?.status === 401) {
         // Redirecionar para login se o token estiver inválido
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         window.location.href = '/login';
       }
       return Promise.reject(error);
     }
   );

   export default api;