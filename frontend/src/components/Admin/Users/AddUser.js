// src/components/Admin/Users/AddUser.js
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user', // padrão
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/users', formData); // Rota protegida (admin)
      setLoading(false);
      navigate('/admin/users');
    } catch (err) {
      console.error('Erro ao adicionar usuário:', err);
      setError(err.response?.data?.message || 'Erro ao adicionar usuário');
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Adicionar Novo Usuário</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Nome */}
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Email */}
        <Form.Group controlId="email" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Senha */}
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Papel */}
        <Form.Group controlId="role" className="mb-3">
          <Form.Label>Papel</Form.Label>
          <Form.Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">Usuário</option>
            <option value="admin">Admin</option>
          </Form.Select>
        </Form.Group>
        
        {/* Botão de Submissão */}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Adicionar Usuário'}
        </Button>
      </Form>
    </div>
  );
};

export default AddUser;