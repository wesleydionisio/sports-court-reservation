   // frontend/src/pages/Login.js
   import React, { useState } from 'react';
   import { useNavigate, useLocation } from 'react-router-dom';
   import { Form, Button, Alert, Container } from 'react-bootstrap';
   import api from '../utils/api'; // Certifique-se de que o caminho está correto

   const Login = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();
     const location = useLocation();

     const handleSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       setError('');

       try {
         // Limpar dados antigos
         localStorage.removeItem('token');
         localStorage.removeItem('user');

         const response = await api.post('/auth/login', { // Rota correta
           email,
           password
         });

         console.log('Resposta do login:', response.data); // Debug

         // Validar resposta
         if (!response.data || !response.data.token || !response.data.user) {
           throw new Error('Resposta inválida do servidor');
         }

         // Salvar dados
         localStorage.setItem('token', response.data.token);
         localStorage.setItem('user', JSON.stringify(response.data.user));

         // Verificar se os dados foram salvos
         const savedToken = localStorage.getItem('token');
         const savedUser = localStorage.getItem('user');

         if (!savedToken || !savedUser) {
           throw new Error('Erro ao salvar dados de autenticação');
         }

         // Verificar se os dados do usuário são válidos
         const parsedUser = JSON.parse(savedUser);
         if (!parsedUser || !parsedUser._id) {
           throw new Error('Dados do usuário inválidos');
         }

         // Redirecionar
         const from = location.state?.from || '/';
         navigate(from, { replace: true });
       } catch (err) {
         console.error('Erro no login:', err);
         setError(
           err.response?.data?.message ||
           err.message ||
           'Erro ao fazer login. Verifique suas credenciais.'
         );
         // Limpar dados em caso de erro
         localStorage.removeItem('token');
         localStorage.removeItem('user');
       } finally {
         setLoading(false);
       }
     };

     return (
       <Container className="mt-5">
         <h2>Login</h2>
         
         {location.state?.message && (
           <Alert variant="info">{location.state.message}</Alert>
         )}
         
         {error && <Alert variant="danger">{error}</Alert>}
         
         <Form onSubmit={handleSubmit}>
           <Form.Group className="mb-3">
             <Form.Label>Email</Form.Label>
             <Form.Control
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Digite seu email"
               required
               disabled={loading}
             />
           </Form.Group>

           <Form.Group className="mb-3">
             <Form.Label>Senha</Form.Label>
             <Form.Control
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Digite sua senha"
               required
               disabled={loading}
             />
           </Form.Group>

           <Button 
             variant="primary" 
             type="submit"
             disabled={loading}
           >
             {loading ? 'Entrando...' : 'Entrar'}
           </Button>
         </Form>
       </Container>
     );
   };

   export default Login;