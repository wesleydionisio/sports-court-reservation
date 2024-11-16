// backend/controllers/reservationController.js
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');

// Função para capitalizar a primeira letra (para corresponder aos dias da semana no backend)
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Criar reserva
exports.createReservation = async (req, res) => {
  console.log('Recebendo dados da reserva:', req.body);
  
  const { courtId, sport, date, timeSlot, paymentMethod, status } = req.body;
  
  try {
    // Verificar se todos os campos necessários estão presentes
    if (!courtId || !sport || !date || !timeSlot || !paymentMethod) {
      console.log('Campos obrigatórios faltando:', {
        courtId: !!courtId,
        sport: !!sport,
        date: !!date,
        timeSlot: !!timeSlot,
        paymentMethod: !!paymentMethod
      });
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios',
        missingFields: {
          courtId: !courtId,
          sport: !sport,
          date: !date,
          timeSlot: !timeSlot,
          paymentMethod: !paymentMethod
        }
      });
    }

    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Quadra não encontrada' });
    }

    // Verificar se o horário está dentro dos horários de funcionamento
    const dayOfWeek = new Date(date).toLocaleDateString('pt-BR', { weekday: 'long' });
    const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    
    const operatingHours = court.operatingHours[capitalizedDayOfWeek];
    if (!operatingHours) {
      return res.status(400).json({ message: 'Quadra fechada no dia selecionado' });
    }

    // Verificar disponibilidade
    const existingReservation = await Reservation.findOne({
      court: courtId,
      date: date,
      time: timeSlot
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Horário já reservado' });
    }

    // Criar a reserva
    const reservation = new Reservation({
      user: req.user._id, // ID do usuário autenticado
      court: courtId,
      sport,
      date,
      time: timeSlot,
      paymentMethod,
      status: status || 'pending'
    });

    const savedReservation = await reservation.save();
    
    // Popular os dados da quadra e do usuário na resposta
    const populatedReservation = await Reservation.findById(savedReservation._id)
      .populate('court', 'name')
      .populate('user', 'name email');

    res.status(201).json(populatedReservation);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ 
      message: 'Erro ao criar reserva',
      error: error.message 
    });
  }
};

// Obter reservas do usuário (Cliente) ou todas (Admin)
exports.getReservations = async (req, res) => {
  try {
    let reservations;
    if (req.user.role === 'admin') {
      reservations = await Reservation.find().populate('court').populate('user', 'name email');
    } else {
      reservations = await Reservation.find({ user: req.user._id }).populate('court');
    }
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao obter reservas' });
  }
};

// Atualizar reserva
exports.updateReservation = async (req, res) => {
  const { sport, date, time, recurrence, paymentMethod } = req.body;
  
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reserva não encontrada' });
    
    // Verificar permissões
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acesso proibido' });
    }
    
    // Atualizar campos
    reservation.sport = sport || reservation.sport;
    reservation.date = date || reservation.date;
    reservation.time = time || reservation.time;
    reservation.recurrence = recurrence || reservation.recurrence;
    reservation.paymentMethod = paymentMethod || reservation.paymentMethod;
    
    // Verificar disponibilidade após atualização
    const existingReservations = await Reservation.find({
      court: reservation.court,
      _id: { $ne: reservation._id },
      date: reservation.date,
      time: reservation.time,
    });
    
    if (existingReservations.length > 0) {
      return res.status(400).json({ message: 'Horário não disponível após atualização' });
    }
    
    // Verificar se o horário está dentro dos horários de funcionamento
    const court = await Court.findById(reservation.court);
    const dayOfWeek = new Date(reservation.date).toLocaleDateString('en-US', { weekday: 'long' });
    const operatingHours = court.operatingHours[capitalizeFirstLetter(dayOfWeek)];
    if (!operatingHours) {
      return res.status(400).json({ message: 'Quadra fechada no dia selecionado' });
    }

    if (reservation.time < operatingHours.open || reservation.time >= operatingHours.close) {
      return res.status(400).json({ message: 'Horário fora dos horários de funcionamento da quadra' });
    }
    
    await reservation.save();
    res.json(reservation);
    
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ message: 'Erro ao atualizar reserva' });
  }
};

// Deletar reserva
exports.deleteReservation = async (req, res) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reserva não encontrada' });
    
    // Verificar permissões
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Acesso proibido' });
    }
    
    await reservation.remove();
    res.json({ message: 'Reserva removida' });
    
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar reserva' });
  }
};

// Função para obter horários reservados para uma quadra em uma data específica
exports.getBookedTimeSlots = async (req, res) => {
  const courtId = req.params.id;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Data é necessária' });
  }

  try {
    const reservations = await Reservation.find({ court: courtId, date });
    const bookedSlots = reservations.map(reservation => reservation.time);
    console.log(`Horários reservados para a quadra ${courtId} na data ${date}:`, bookedSlots); // Log de depuração
    res.json({ bookedSlots });
  } catch (error) {
    console.error('Erro ao buscar horários reservados:', error);
    res.status(500).json({ message: 'Erro ao buscar horários reservados' });
  }
};