import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import api from '../../utils/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReservationManagement = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data);
    } catch (error) {
      setError('Erro ao carregar reservas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta reserva?')) {
      try {
        await api.delete(`/reservations/${id}`);
        fetchReservations();
      } catch (error) {
        setError('Erro ao excluir reserva');
        console.error(error);
      }
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/reservations/${selectedReservation._id}`, {
        status: selectedReservation.status
      });
      setShowEditModal(false);
      fetchReservations();
    } catch (error) {
      setError('Erro ao atualizar reserva');
      console.error(error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Gerenciamento de Reservas</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Quadra</th>
            <th>Data</th>
            <th>Horário</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>{reservation.user.name}</td>
              <td>{reservation.court.name}</td>
              <td>{format(new Date(reservation.date), 'dd/MM/yyyy', { locale: ptBR })}</td>
              <td>{reservation.time}</td>
              <td>
                <Badge bg={
                  reservation.status === 'confirmed' ? 'success' :
                  reservation.status === 'cancelled' ? 'danger' :
                  'warning'
                }>
                  {reservation.status}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(reservation)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(reservation._id)}
                >
                  Excluir
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Reserva</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateStatus}>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={selectedReservation?.status}
                onChange={(e) => setSelectedReservation({
                  ...selectedReservation,
                  status: e.target.value
                })}
              >
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmada</option>
                <option value="cancelled">Cancelada</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Salvar Alterações
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ReservationManagement; 