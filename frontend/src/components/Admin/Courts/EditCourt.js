// src/components/Admin/Courts/EditCourt.js
import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';

const EditCourt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    mainPhoto: '',
    gallery: '',
    description: '',
    allowedSports: [],
    operatingHours: {
      Monday: { open: '', close: '' },
      Tuesday: { open: '', close: '' },
      Wednesday: { open: '', close: '' },
      Thursday: { open: '', close: '' },
      Friday: { open: '', close: '' },
      Saturday: { open: '', close: '' },
      Sunday: { open: '', close: '' },
    },
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchCourt = async () => {
      try {
        const response = await api.get(`/api/courts/${id}`);
        const court = response.data;
        setFormData({
          name: court.name,
          mainPhoto: court.mainPhoto,
          gallery: court.gallery.join(', '),
          description: court.description,
          allowedSports: court.allowedSports,
          operatingHours: court.operatingHours,
        });
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar quadra:', err);
        setError('Erro ao carregar quadra.');
        setLoading(false);
      }
    };
    
    fetchCourt();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para campos aninhados (operatingHours)
    if (name.startsWith('operatingHours')) {
      const [_, day, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        operatingHours: {
          ...prev.operatingHours,
          [day]: {
            ...prev.operatingHours[day],
            [field]: value,
          },
        },
      }));
    } else if (name === 'allowedSports') {
      // Para múltiplos esportes
      const sports = value.split(',').map(sport => sport.trim());
      setFormData(prev => ({
        ...prev,
        allowedSports: sports,
      }));
    } else if (name === 'gallery') {
      // Para múltiplas imagens na galeria
      const images = value.split(',').map(url => url.trim());
      setFormData(prev => ({
        ...prev,
        gallery: images,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const updatedData = {
        name: formData.name,
        mainPhoto: formData.mainPhoto,
        gallery: formData.gallery.split(',').map(url => url.trim()),
        description: formData.description,
        allowedSports: formData.allowedSports,
        operatingHours: formData.operatingHours,
      };
      
      await api.put(`/api/courts/${id}`, updatedData); // Rota protegida (admin)
      setLoading(false);
      navigate('/admin/courts');
    } catch (err) {
      console.error('Erro ao atualizar quadra:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar quadra');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  return (
    <div>
      <h2>Editar Quadra</h2>
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
        
        {/* Foto Principal */}
        <Form.Group controlId="mainPhoto" className="mb-3">
          <Form.Label>Foto Principal (URL)</Form.Label>
          <Form.Control
            type="text"
            name="mainPhoto"
            value={formData.mainPhoto}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Galeria */}
        <Form.Group controlId="gallery" className="mb-3">
          <Form.Label>Galeria de Imagens (URLs, separadas por vírgula)</Form.Label>
          <Form.Control
            type="text"
            name="gallery"
            value={formData.gallery}
            onChange={handleChange}
          />
        </Form.Group>
        
        {/* Descrição */}
        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Descrição</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Esportes Permitidos */}
        <Form.Group controlId="allowedSports" className="mb-3">
          <Form.Label>Esportes Permitidos (separados por vírgula)</Form.Label>
          <Form.Control
            type="text"
            name="allowedSports"
            value={formData.allowedSports.join(', ')}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Horários de Funcionamento */}
        <h4>Horários de Funcionamento</h4>
        {Object.keys(formData.operatingHours).map(day => (
          <Form.Group key={day} controlId={`operatingHours.${day}.open`} className="mb-3">
            <Form.Label>{day} - Abertura</Form.Label>
            <Form.Control
              type="time"
              name={`operatingHours.${day}.open`}
              value={formData.operatingHours[day].open}
              onChange={handleChange}
              required
            />
            <Form.Label>{day} - Fechamento</Form.Label>
            <Form.Control
              type="time"
              name={`operatingHours.${day}.close`}
              value={formData.operatingHours[day].close}
              onChange={handleChange}
              required
            />
          </Form.Group>
        ))}
        
        {/* Botão de Submissão */}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Atualizar Quadra'}
        </Button>
      </Form>
    </div>
  );
};

export default EditCourt;