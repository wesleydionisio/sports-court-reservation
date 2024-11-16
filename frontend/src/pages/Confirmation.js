// src/pages/Confirmation.js
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Confirmation = () => {
  const location = useLocation();
  const reservation = location.state?.reservation;

  if (!reservation) {
    return <Navigate to="/" replace />;
  }

  // Função para formatar a data e hora
  const formatDateTime = (date, time) => {
    try {
      // Combina a data e hora em um único string
      const dateTimeStr = `${date}T${time}`;
      const dateTime = new Date(dateTimeStr);

      return format(dateTime, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
        locale: ptBR
      });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data não disponível';
    }
  };

  // Calcula o horário de término (assumindo 1 hora de duração)
  const getEndTime = (time) => {
    try {
      const [hours, minutes] = time.split(':');
      const endHour = (parseInt(hours) + 1).toString().padStart(2, '0');
      return `${endHour}:${minutes}`;
    } catch (error) {
      console.error('Erro ao calcular horário de término:', error);
      return 'Horário não disponível';
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reserva Confirmada</h2>
      <Card>
        <Card.Body>
          <Card.Title>{reservation.court?.name || 'Quadra'}</Card.Title>
          <Card.Text>
            <strong>Esporte:</strong> {reservation.sport}<br />
            <strong>Data e Hora:</strong> {formatDateTime(reservation.date, reservation.time)}<br />
            <strong>Término:</strong> {formatDateTime(reservation.date, getEndTime(reservation.time))}<br />
            <strong>Forma de Pagamento:</strong> {
              reservation.paymentMethod === 'pagamento_no_ato' ? 'Pagamento no local' :
              reservation.paymentMethod === 'cartao_credito' ? 'Cartão de Crédito' :
              'PayPal'
            }<br />
            <strong>Status:</strong> {
              reservation.status === 'pending' ? 'Pendente' :
              reservation.status === 'confirmed' ? 'Confirmada' :
              'Cancelada'
            }
          </Card.Text>
          <Button variant="primary" href="/">Voltar para Home</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Confirmation;