// src/pages/Confirmation.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

const Confirmation = () => {
  const location = useLocation();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return (
      <div>
        <h2>Nenhuma reserva encontrada.</h2>
        <Button as={Link} to="/" variant="primary">Voltar para Home</Button>
      </div>
    );
  }

  return (
    <div>
      <h2>Reserva Confirmada</h2>
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>{reservation.court.name}</Card.Title>
          <Card.Text>
            <strong>Esporte:</strong> {reservation.sport}<br />
            <strong>Início:</strong> {new Date(reservation.startTime).toLocaleString()}<br />
            <strong>Fim:</strong> {new Date(reservation.endTime).toLocaleString()}<br />
            <strong>Recorrência:</strong> {reservation.recurrence}<br />
            <strong>Forma de Pagamento:</strong> {reservation.paymentMethod}<br />
          </Card.Text>
          <Button as={Link} to="/" variant="primary">Voltar para Home</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Confirmation;