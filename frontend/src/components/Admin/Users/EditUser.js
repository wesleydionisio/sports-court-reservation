// src/components/Admin/Users/EditUser.js
import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/users/${id}`); // Rota protegida (admin)
        const user = response.data;
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
        });
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar usuário:', err);
        setError('Erro ao carregar usuário.');
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [id]);
  
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
      const updatedData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      
      await api.put(`/api/users/${id}`, updatedData); // Rota protegida (admin)
      setLoading(false);
      navigate('/admin/users');
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar usuário');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  return (
    <div>
      <h2>Editar Usuário</h2>
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
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Atualizar Usuário'}
        </Button>
      </Form>
    </div>
  );
};

export default EditUser;