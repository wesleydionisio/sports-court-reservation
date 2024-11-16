// src/components/Admin/Reservations/ReservationsList.js
import React, { useEffect, useState } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../../utils/api';

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const fetchReservations = async () => {
    try {
      const response = await api.get('/api/reservations'); // Rota protegida (admin)
      setReservations(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
      setError(true);
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja remover esta reserva?')) {
      try {
        await api.delete(`/api/reservations/${id}`); // Rota protegida (admin)
        setReservations(reservations.filter(reservation => reservation._id !== id));
      } catch (err) {
        console.error('Erro ao remover reserva:', err);
        alert('Erro ao remover reserva');
      }
    }
  };
  
  useEffect(() => {
    fetchReservations();
  }, []);
  
  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }
  
  if (error) {
    return <Alert variant="danger">Erro ao carregar reservas.</Alert>;
  }
  
  return (
    <div>
      <h2>Gerenciamento de Reservas</h2>
      <Button as={Link} to="/admin/reservations/add" className="mb-3">
        Criar Reserva
      </Button>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Quadra</th>
            <th>Esporte</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Forma de Pagamento</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <tr key={reservation._id}>
              <td>{reservation.user.name}</td>
              <td>{reservation.court.name}</td>
              <td>{reservation.sport}</td>
              <td>{reservation.date}</td>
              <td>{reservation.time}</td>
              <td>{reservation.paymentMethod.replace('_', ' ').toUpperCase()}</td>
              <td>
                <Button
                  as={Link}
                  to={`/admin/reservations/edit/${reservation._id}`}
                  variant="warning"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(reservation._id)}
                >
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReservationsList;