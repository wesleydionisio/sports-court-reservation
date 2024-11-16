   // frontend/src/pages/Login.js
   import React, { useState } from 'react';
   import { Container, Form, Button, Alert } from 'react-bootstrap';
   import { useNavigate } from 'react-router-dom';
   import { useAuth } from '../contexts/AuthContext';

   const Login = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const navigate = useNavigate();
     const { login } = useAuth();
     const [isLoading, setIsLoading] = useState(false);

     const handleSubmit = async (e) => {
       e.preventDefault();
       setError('');
       setIsLoading(true);

       try {
         await login(email, password);
         navigate('/dashboard');
       } catch (error) {
         console.error('Erro completo:', error);
         setError('Erro ao fazer login. Verifique suas credenciais.');
       } finally {
         setIsLoading(false);
       }
     };

     return (
       <Container className="mt-5">
         <div className="row justify-content-center">
           <div className="col-md-6">
             {error && <Alert variant="danger">{error}</Alert>}
             <Form onSubmit={handleSubmit}>
               <Form.Group className="mb-3">
                 <Form.Label>Email</Form.Label>
                 <Form.Control
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   autoComplete="username"
                 />
               </Form.Group>

               <Form.Group className="mb-3">
                 <Form.Label>Senha</Form.Label>
                 <Form.Control
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   autoComplete="current-password"
                 />
               </Form.Group>

               <Button 
                 variant="primary" 
                 type="submit" 
                 className="w-100"
                 disabled={isLoading}
               >
                 {isLoading ? 'Carregando...' : 'Entrar'}
               </Button>
             </Form>
           </div>
         </div>
       </Container>
     );
   };

   export default Login;