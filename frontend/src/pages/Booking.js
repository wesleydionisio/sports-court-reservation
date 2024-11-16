// src/pages/Booking.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
  const { courtId } = useParams();  // Pegando o ID da URL
  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Buscar dados da quadra
  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        console.log('Court ID recebido:', courtId);
        if (!courtId) {
          setError('ID da quadra não fornecido');
          setLoading(false);
          return;
        }

        const response = await api.get(`/api/courts/${courtId}`);
        console.log('Court Data:', response.data);
        setCourt(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados da quadra:', error);
        setError('Erro ao carregar dados da quadra');
        setLoading(false);
      }
    };

    fetchCourtData();
  }, [courtId]);

  // Buscar horários reservados
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!courtId) return;

      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await api.get(`/api/courts/${courtId}/bookedSlots`, {
          params: { date: formattedDate }
        });
        setBookedTimeSlots(response.data);
      } catch (error) {
        console.error('Erro ao buscar horários reservados:', error);
      }
    };

    fetchBookedSlots();
  }, [courtId, selectedDate]);

  const handleDateChange = (date) => {
    console.log('Data selecionada:', date.toISOString().split('T')[0]);
    setSelectedDate(date);
    setSelectedTimeSlot('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!courtId) {
      console.log('Court ID não definido');
      return;
    }

    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      await api.post('/api/reservations', {
        courtId,
        date: formattedDate,
        timeSlot: selectedTimeSlot
      });
      // Redirecionar ou mostrar mensagem de sucesso
    } catch (error) {
      setError('Erro ao fazer reserva');
      console.error('Erro na reserva:', error);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!court) return <Alert variant="warning">Quadra não encontrada</Alert>;

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>{court.name}</h2>
          <img 
            src={court.mainPhoto} 
            alt={court.name} 
            style={{ maxWidth: '100%', height: 'auto' }} 
          />
          <p className="mt-3">{court.description}</p>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Selecione a Data</Form.Label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date()}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Horário</Form.Label>
              <Form.Control
                as="select"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                <option value="">Selecione um horário</option>
                {/* Adicione as opções de horário aqui */}
                <option value="08:00">08:00</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                {/* ... mais horários ... */}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" variant="primary">
          Reservar
        </Button>
      </Form>
    </Container>
  );
};

export default Booking;