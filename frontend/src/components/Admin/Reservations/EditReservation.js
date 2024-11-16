// src/components/Admin/Reservations/EditReservation.js
import React, { useEffect, useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/api';

const EditReservation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [courts, setCourts] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [formData, setFormData] = useState({
    userId: '',
    courtId: '',
    sport: '',
    date: '',
    time: '',
    recurrence: 'nenhuma',
    paymentMethod: 'pagamento_no_ato',
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchData = async () => {
    try {
      const [courtsRes, usersRes, reservationRes] = await Promise.all([
        api.get('/api/courts'),
        api.get('/api/users'),
        api.get(`/api/reservations/${id}`),
      ]);
      const reservation = reservationRes.data;
      setCourts(courtsRes.data);
      setUsers(usersRes.data);
      setFormData({
        userId: reservation.user._id,
        courtId: reservation.court._id,
        sport: reservation.sport,
        date: reservation.date,
        time: reservation.time,
        recurrence: reservation.recurrence,
        paymentMethod: reservation.paymentMethod,
      });
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Erro ao carregar reserva.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
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
      await api.put(`/api/reservations/${id}`, formData); // Rota protegida (admin)
      setLoading(false);
      navigate('/admin/reservations');
    } catch (err) {
      console.error('Erro ao atualizar reserva:', err);
      setError(err.response?.data?.message || 'Erro ao atualizar reserva');
      setLoading(false);
    }
  };
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  return (
    <div>
      <h2>Editar Reserva</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        {/* Seleção de Usuário */}
        <Form.Group controlId="userId" className="mb-3">
          <Form.Label>Usuário</Form.Label>
          <Form.Select
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um usuário</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        
        {/* Seleção de Quadra */}
        <Form.Group controlId="courtId" className="mb-3">
          <Form.Label>Quadra</Form.Label>
          <Form.Select
            name="courtId"
            value={formData.courtId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma quadra</option>
            {courts.map(court => (
              <option key={court._id} value={court._id}>
                {court.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        
        {/* Esporte */}
        <Form.Group controlId="sport" className="mb-3">
          <Form.Label>Esporte</Form.Label>
          <Form.Control
            type="text"
            name="sport"
            value={formData.sport}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Data */}
        <Form.Group controlId="date" className="mb-3">
          <Form.Label>Data</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Horário */}
        <Form.Group controlId="time" className="mb-3">
          <Form.Label>Horário</Form.Label>
          <Form.Control
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </Form.Group>
        
        {/* Recorrência */}
        <Form.Group controlId="recurrence" className="mb-3">
          <Form.Label>Recorrência</Form.Label>
          <Form.Select
            name="recurrence"
            value={formData.recurrence}
            onChange={handleChange}
            required
          >
            <option value="nenhuma">Nenhuma</option>
            <option value="1_mes">1 Mês</option>
            <option value="2_meses">2 Meses</option>
            <option value="3_meses">3 Meses</option>
          </Form.Select>
        </Form.Group>
        
        {/* Forma de Pagamento */}
        <Form.Group controlId="paymentMethod" className="mb-3">
          <Form.Label>Forma de Pagamento</Form.Label>
          <Form.Select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
          >
            <option value="pagamento_no_ato">Pagamento no Ato</option>
            <option value="cartao_credito">Cartão de Crédito</option>
            <option value="paypal">PayPal</option>
          </Form.Select>
        </Form.Group>
        
        {/* Botão de Submissão */}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Atualizar Reserva'}
        </Button>
      </Form>
    </div>
  );
};

export default EditReservation;