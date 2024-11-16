import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations/user');
      setReservations(response.data);
    } catch (error) {
      setError('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Meu Perfil</Card.Title>
          <Card.Text>
            <strong>Nome:</strong> {user.name}<br />
            <strong>Email:</strong> {user.email}<br />
            <strong>Tipo de Conta:</strong> {user.role}
          </Card.Text>
        </Card.Body>
      </Card>

      <h3 className="mt-4">Minhas Reservas</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {loading ? (
        <div>Carregando...</div>
      ) : (
        reservations.map(reservation => (
          <Card key={reservation._id} className="mt-3">
            <Card.Body>
              <Card.Title>{reservation.court.name}</Card.Title>
              <Card.Text>
                <strong>Data:</strong> {new Date(reservation.date).toLocaleDateString()}<br />
                <strong>Horário:</strong> {reservation.time}<br />
                <strong>Esporte:</strong> {reservation.sport}<br />
                <strong>Status:</strong> {reservation.status}
              </Card.Text>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default Profile; 