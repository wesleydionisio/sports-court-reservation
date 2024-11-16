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
import { format } from 'date-fns';

const Booking = () => {
  const { id } = useParams(); // ID da quadra
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Dados do formulário
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const paymentMethods = ['pagamento_no_ato', 'cartao_credito', 'paypal']; // Exemplos de métodos

  // Estados de reserva
  const [reserving, setReserving] = useState(false);
  const [reservationError, setReservationError] = useState('');

  // Função para buscar dados da quadra
  const fetchCourt = async () => {
    try {
      const response = await api.get(`/courts/${id}`);
      setCourt(response.data);
      console.log('Court Data:', response.data); // Log de depuração
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
          const dayOfWeekRaw = selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' });
          const dayOfWeek = capitalizeFirstLetter(dayOfWeekRaw);
          console.log(`Dia da semana (capitalizado): ${dayOfWeek}`);
          console.log('Operating Hours:', court.operatingHours);

          const operatingHours = court.operatingHours[dayOfWeek];
          console.log(`Horários de funcionamento:`, operatingHours);

          if (!operatingHours) {
            console.warn('Quadra fechada neste dia.');
            setAvailableTimeSlots([]);
            return;
          }

          const allSlots = generateTimeSlots(operatingHours.open, operatingHours.close, 60); // Intervalo de 60 minutos
          console.log(`Todos os horários possíveis:`, allSlots);

          // Filtrar os slots que não estão reservados
          const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
          console.log(`Horários disponíveis:`, availableSlots);

          setAvailableTimeSlots(availableSlots);
          setSelectedTimeSlot(''); // Resetar o time slot selecionado
        } catch (error) {
          console.error('Erro ao buscar horários reservados:', error);
          setAvailableTimeSlots([]);
          setReservationError('Erro ao buscar horários disponíveis. Tente novamente mais tarde.');
        }
      } else {
        setAvailableTimeSlots([]);
        setSelectedTimeSlot('');
      }
    };

    fetchBookedSlots();
    // eslint-disable-next-line
  }, [selectedDate, court]);

  // Função auxiliar para verificar se o horário está dentro do período de funcionamento
  const isTimeSlotValid = (timeSlot, openTime, closeTime) => {
    const convertToMinutes = (timeStr) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const slotMinutes = convertToMinutes(timeSlot);
    const openMinutes = convertToMinutes(openTime);
    const closeMinutes = convertToMinutes(closeTime);

    return slotMinutes >= openMinutes && slotMinutes < closeMinutes;
  };

  // Função para filtrar as datas disponíveis
  const filterAvailableDates = (date) => {
    const dayOfWeek = capitalizeFirstLetter(
      date.toLocaleDateString('pt-BR', { weekday: 'long' })
    );
    return court.operatingHours[dayOfWeek] !== undefined;
  };

  // Adicione esta função de utilidade no início do componente
  const isCourtOpenOnDate = (date, operatingHours) => {
    // Obter o dia da semana em português e capitalizar
    const dayOfWeek = capitalizeFirstLetter(
      date.toLocaleDateString('pt-BR', { weekday: 'long' })
    );
    
    // Verificar se existe horário de funcionamento para este dia
    return Boolean(operatingHours[dayOfWeek]);
  };

  // Função de submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setReserving(true);
    setReservationError('');

    try {
<<<<<<< Updated upstream
      // Verificar token primeiro
      const token = localStorage.getItem('token');
      if (!token) {
        setReservationError('Você precisa estar logado para fazer uma reserva');
        navigate('/login', { state: { from: `/booking/${id}` } });
        return;
      }

      // Verificar dados do usuário com tratamento de erro melhorado
      let user = null;
      const userStr = localStorage.getItem('user');
      
      if (!userStr) {
        console.log('Nenhum dado de usuário encontrado no localStorage');
        setReservationError('Sessão expirada. Por favor, faça login novamente');
        navigate('/login', { state: { from: `/booking/${id}` } });
        return;
      }

      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error('Erro ao parsear dados do usuário:', error);
        // Limpar dados inválidos
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setReservationError('Erro na sessão. Por favor, faça login novamente');
        navigate('/login', { state: { from: `/booking/${id}` } });
        return;
      }

      if (!user || !user._id) {
        console.error('Dados do usuário inválidos:', user);
        setReservationError('Dados do usuário inválidos. Por favor, faça login novamente');
        navigate('/login', { state: { from: `/booking/${id}` } });
        return;
      }

      // Se chegou aqui, temos os dados do usuário
=======
      // Formata a data para o formato correto (YYYY-MM-DD)
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

>>>>>>> Stashed changes
      const reservationData = {
        userId: user._id,
        courtId: id,
        sport: selectedSport,
        date: formattedDate,
        time: selectedTimeSlot, // Garante que está usando 'time' em vez de 'timeSlot'
        paymentMethod: selectedPaymentMethod,
        status: 'pending'
      };

      console.log('Dados da reserva:', reservationData); // Debug

      const response = await api.post('/reservations', reservationData);
<<<<<<< Updated upstream
      navigate('/confirmation', { state: { reservation: response.data } });
=======
      
      if (response.data) {
        navigate('/confirmation', { 
          state: { 
            reservation: {
              ...response.data,
              court: court // Inclui os dados da quadra
            }
          } 
        });
      }
>>>>>>> Stashed changes
    } catch (err) {
      console.error('Erro na reserva:', err);
      setReservationError(
        err.response?.data?.message || 
        'Erro ao criar reserva. Por favor, tente novamente.'
      );
    } finally {
      setReserving(false);
    }
  };

  // Verificação de autenticação
  useEffect(() => {
    const verifyAuth = () => {
      try {
        // Verificar token
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token não encontrado');
        }

        // Verificar dados do usuário
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('Dados do usuário não encontrados');
        }

        let user;
        try {
          user = JSON.parse(userStr);
        } catch (e) {
          throw new Error('Dados do usuário inválidos');
        }

        if (!user || !user._id) {
          throw new Error('Dados do usuário incompletos');
        }

        // Se chegou aqui, está autenticado
        setIsAuthenticated(true);
      } catch (error) {
        console.log('Erro de autenticação:', error.message);
        // Limpar dados inválidos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirecionar para login
        navigate('/login', {
          state: {
            from: `/booking/${id}`,
            message: 'Por favor, faça login para continuar'
          }
        });
      }
    };

    verifyAuth();
  }, [navigate, id]);

  // Renderização condicional baseada na autenticação
  if (!isAuthenticated) {
    return null; // ou um componente de loading
  }

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  if (error || !court) {
    return <Alert variant="danger">Quadra não encontrada.</Alert>;
  }

  return (
    <div className="container mt-4">
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
                  type="button" // Evitar submissão do formulário
                  variant={selectedSport === sport ? 'primary' : 'outline-primary'}
                  className="me-2 mb-2"
                  onClick={() => {
                    setSelectedSport(sport);
                    console.log(`Esporte selecionado: ${sport}`);
                  }}
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
            onChange={(date) => {
              if (isCourtOpenOnDate(date, court.operatingHours)) {
                setSelectedDate(date);
                setSelectedTimeSlot(''); // Resetar o horário selecionado
              } else {
                setReservationError('A quadra está fechada neste dia');
              }
            }}
            filterDate={(date) => isCourtOpenOnDate(date, court.operatingHours)}
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
                availableTimeSlots.map((time, index) => {
                  const dayOfWeek = capitalizeFirstLetter(
                    selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })
                  );
                  const dayHours = court.operatingHours[dayOfWeek];
                  const [timeHour] = time.split(':');
                  const [openHour] = dayHours.open.split(':');
                  const [closeHour] = dayHours.close.split(':');
                  
                  const isValidTime = 
                    parseInt(timeHour) >= parseInt(openHour) && 
                    parseInt(timeHour) < parseInt(closeHour);

                  return isValidTime ? (
                    <Button
                      key={index}
                      type="button"
                      variant={selectedTimeSlot === time ? 'primary' : 'outline-primary'}
                      className="me-2 mb-2"
                      onClick={() => setSelectedTimeSlot(time)}
                    >
                      {time}
                    </Button>
                  ) : null;
                })
              ) : (
                <Alert variant="warning">
                  Nenhum horário disponível para a data selecionada.
                </Alert>
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
        <Form.Check
          key={index}
          type="radio"
          id={`payment-method-${index}`}
          name="paymentMethod"
          value={method}
          label={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {Icon && <Icon className="me-2" />}
              {method.replace('_', ' ').toUpperCase()}
            </span>
          }
          checked={selectedPaymentMethod === method}
          onChange={(e) => {
            setSelectedPaymentMethod(e.target.value);
            console.log(`Forma de pagamento selecionada: ${e.target.value}`);
          }}
          required
        />
      );
    })}
  </div>
</Form.Group>

        {/* Mensagens de Erro */}
        {reservationError && <Alert variant="danger">{reservationError}</Alert>}

        {/* Botão de Submissão */}
        <Button
          variant="success"
          type="submit"
          disabled={reserving}
        >
          {reserving ? 'Reservando...' : 'Proseguir'}
        </Button>
      </Form>
    </div>
  );
};

export default Booking;