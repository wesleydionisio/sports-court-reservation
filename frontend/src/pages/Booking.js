// src/pages/Booking.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCreditCard, FaPaypal } from 'react-icons/fa'; // Importar ícones de pagamento
import { FaFootballBall, FaBasketballBall, FaVolleyballBall } from 'react-icons/fa'; // Importar ícones de esportes
import api from '../utils/api';
import {
  Form,
  Button,
  Spinner,
  Alert,
  Badge,
  ListGroup,
  Image,
  Carousel,
} from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const { id } = useParams(); // ID da quadra
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Dados do formulário
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const paymentMethods = ['pagamento_no_ato', 'cartao_credito', 'paypal']; // Exemplo de métodos

  // Estados de reserva
  const [reserving, setReserving] = useState(false);
  const [reservationError, setReservationError] = useState('');

  const fetchCourt = async () => {
    try {
      const response = await api.get(`/courts/${id}`);
      setCourt(response.data);
      console.log('Court operatingHours:', response.data.operatingHours); // Log de depuração
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar quadra:', err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourt();
    // eslint-disable-next-line
  }, [id]);

  // Função para gerar time slots dentro dos horários de funcionamento
  const generateTimeSlots = (openTime, closeTime, interval = 60) => {
    const slots = [];
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    let start = new Date();
    start.setHours(openHour, openMinute, 0, 0);
    const end = new Date();
    end.setHours(closeHour, closeMinute, 0, 0);

    while (start < end) {
      const hour = start.getHours().toString().padStart(2, '0');
      const minute = start.getMinutes().toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
      start.setMinutes(start.getMinutes() + interval);
    }

    return slots;
  };

  // Função para capitalizar a primeira letra (para corresponder aos dias da semana no backend)
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Atualizar os time slots quando uma data é selecionada
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (selectedDate && court) {
        const dateStr = selectedDate.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        console.log(`Data selecionada: ${dateStr}`);

        try {
          const response = await api.get(`/courts/${id}/bookedSlots`, {
            params: { date: dateStr },
          });
          const bookedSlots = response.data.bookedSlots;
          console.log(`Horários reservados:`, bookedSlots);

          // Obter os horários de funcionamento para o dia selecionado
          const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }); // Alterado para 'en-US'
          console.log(`Dia da semana: ${dayOfWeek}`);
          const operatingHours = court.operatingHours[capitalizeFirstLetter(dayOfWeek)];
          console.log(`Horários de funcionamento:`, operatingHours);

          if (!operatingHours) {
            console.warn('Quadra fechada neste dia.');
            setAvailableTimeSlots([]);
            return;
          }

          const allSlots = generateTimeSlots(operatingHours.open, operatingHours.close, 60); // Intervalo de 60 minutos
          console.log(`Todos os horários possíveis:`, allSlots);

          const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
          console.log(`Horários disponíveis:`, availableSlots);

          setAvailableTimeSlots(availableSlots);
          setSelectedTimeSlot(''); // Resetar o time slot selecionado
        } catch (error) {
          console.error('Erro ao buscar horários reservados:', error);
          setAvailableTimeSlots([]);
        }
      } else {
        setAvailableTimeSlots([]);
        setSelectedTimeSlot('');
      }
    };

    fetchBookedSlots();
    // eslint-disable-next-line
  }, [selectedDate, court]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReserving(true);
    setReservationError('');

    // Validar se todos os campos estão preenchidos
    if (!selectedSport || !selectedDate || !selectedTimeSlot || !selectedPaymentMethod) {
      setReservationError('Por favor, preencha todos os campos.');
      setReserving(false);
      return;
    }

    // Criar o objeto de reserva
    const reservationData = {
      courtId: id,
      sport: selectedSport,
      date: selectedDate.toISOString().split('T')[0], // Formato YYYY-MM-DD
      time: selectedTimeSlot,
      recurrence: 'nenhuma', // Pode ser ajustado conforme necessidade
      paymentMethod: selectedPaymentMethod,
    };

    console.log('Dados da reserva:', reservationData); // Log de depuração

    try {
      const response = await api.post('/reservations', reservationData);
      // Redirecionar para a página de confirmação com os dados da reserva
      navigate('/confirmation', { state: { reservation: response.data } });
    } catch (err) {
      console.error('Erro ao criar reserva:', err);
      setReservationError(err.response?.data?.message || 'Erro ao criar reserva');
      setReserving(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error || !court) {
    return <Alert variant="danger">Quadra não encontrada.</Alert>;
  }

  return (
    <div>
      {/* Seção de Detalhes da Quadra */}
      <div className="mb-4">
        {/* Foto Principal da Quadra */}
        <Image src={court.mainPhoto} alt={court.name} fluid rounded className="mb-3" />

        {/* Carrossel de Imagens da Galeria (Opcional) */}
        {court.gallery && court.gallery.length > 0 && (
          <Carousel className="mb-3">
            {court.gallery.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={image}
                  alt={`Slide ${index + 1}`}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        )}

        {/* Nome da Quadra */}
        <h2>{court.name}</h2>

        {/* Descrição da Quadra */}
        <p>{court.description}</p>

        {/* Esportes Permitidos */}
        <h5>Esportes Permitidos:</h5>
        <div className="mb-3">
          {court.allowedSports.map((sport, index) => (
            <Badge bg="success" key={index} className="me-2">
              {sport}
            </Badge>
          ))}
        </div>

        {/* Horários de Funcionamento */}
        <h5>Horários de Funcionamento:</h5>
        <ListGroup className="mb-3">
          {Object.entries(court.operatingHours).map(([day, hours], index) => (
            <ListGroup.Item key={index}>
              <strong>{day}:</strong> {hours.open} - {hours.close}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Datas e Horários Disponíveis */}
        <h5>Datas e Horários Disponíveis:</h5>
        <ListGroup className="mb-3">
          {court.availableDatesTimes.map((entry, index) => (
            <ListGroup.Item key={index}>
              <strong>{new Date(entry.date).toLocaleDateString('pt-BR')}</strong>: {entry.times.join(', ')}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      {/* Formulário de Reserva */}
      <h3>Fazer Reserva</h3>
      <Form onSubmit={handleSubmit}>
        {/* Seleção de Esporte */}
        <Form.Group controlId="sport" className="mb-3">
          <Form.Label>Esporte</Form.Label>
          <div>
            {court.allowedSports.map((sport, index) => {
              // Escolher ícone com base no esporte
              let Icon;
              switch (sport.toLowerCase()) {
                case 'futebol':
                  Icon = FaFootballBall;
                  break;
                case 'basquete':
                  Icon = FaBasketballBall;
                  break;
                case 'vôlei':
                  Icon = FaVolleyballBall;
                  break;
                default:
                  Icon = null;
              }

              return (
                <Button
                  key={index}
                  variant={selectedSport === sport ? 'primary' : 'outline-primary'}
                  className="me-2 mb-2"
                  onClick={() => setSelectedSport(sport)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {Icon && <Icon className="me-2" />}
                  {sport}
                </Button>
              );
            })}
          </div>
        </Form.Group>

        {/* Seleção de Data */}
        <Form.Group controlId="date" className="mb-3">
          <Form.Label>Data</Form.Label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
            placeholderText="Selecione uma data"
            className="form-control"
            required
          />
        </Form.Group>

        {/* Seleção de Time Slot */}
        {selectedDate && (
          <Form.Group controlId="timeSlot" className="mb-3">
            <Form.Label>Horário</Form.Label>
            <div>
              {availableTimeSlots.length > 0 ? (
                availableTimeSlots.map((time, index) => (
                  <Button
                    key={index}
                    variant={selectedTimeSlot === time ? 'primary' : 'outline-primary'}
                    className="me-2 mb-2"
                    onClick={() => setSelectedTimeSlot(time)}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {/* Placeholder para ícone à esquerda */}
                    {time}
                  </Button>
                ))
              ) : (
                <Alert variant="warning">Nenhum horário disponível para a data selecionada.</Alert>
              )}
            </div>
          </Form.Group>
        )}

        {/* Seleção de Forma de Pagamento */}
        <Form.Group controlId="paymentMethod" className="mb-3">
          <Form.Label>Forma de Pagamento</Form.Label>
          <div>
            {paymentMethods.map((method, index) => {
              // Escolher ícone com base no método de pagamento
              let Icon;
              switch (method) {
                case 'cartao_credito':
                  Icon = FaCreditCard;
                  break;
                case 'paypal':
                  Icon = FaPaypal;
                  break;
                case 'pagamento_no_ato':
                  Icon = null; // Adicione um ícone apropriado se desejar
                  break;
                default:
                  Icon = null;
              }

              return (
                <Button
                  key={index}
                  variant={selectedPaymentMethod === method ? 'success' : 'outline-success'}
                  className="me-2 mb-2"
                  onClick={() => setSelectedPaymentMethod(method)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  {Icon && <Icon className="me-2" />}
                  {method.replace('_', ' ').toUpperCase()}
                </Button>
              );
            })}
          </div>
        </Form.Group>

        {/* Mensagens de Erro */}
        {reservationError && <Alert variant="danger">{reservationError}</Alert>}

        {/* Botão de Submissão */}
        <Button variant="success" type="submit" disabled={reserving}>
          {reserving ? 'Procurando...' : 'Proseguir'}
        </Button>
      </Form>
    </div>
  );
};

export default Booking;