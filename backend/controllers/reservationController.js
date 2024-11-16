// backend/controllers/reservationController.js
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');

// Função para capitalizar a primeira letra (para corresponder aos dias da semana no backend)
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Criar reserva
exports.createReservation = async (req, res) => {
<<<<<<< Updated upstream
  const { courtId, sport, date, time, recurrence, paymentMethod } = req.body;
  
  try {
    console.log('Recebendo dados da reserva:', req.body);
    
    // Verificar se todos os campos obrigatórios estão presentes
    if (!courtId || !sport || !date || !time || !paymentMethod) {
      console.log('Campos obrigatórios ausentes.');
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    
       // Validar forma de pagamento
       const validPaymentMethods = ['pagamento_no_ato', 'cartao_credito', 'paypal'];
       if (!validPaymentMethods.includes(paymentMethod)) {
         console.log('Forma de Pagamento inválida:', paymentMethod);
         return res.status(400).json({ message: 'Forma de Pagamento inválida.' });
       }
       
       const court = await Court.findById(courtId);
       if (!court) {
         console.log('Quadra não encontrada:', courtId);
         return res.status(404).json({ message: 'Quadra não encontrada' });
       }

        // Dividir a data em componentes
        const [year, month, day] = date.split('-').map(Number);
        // Criar objeto Date local
        const dateObj = new Date(year, month - 1, day);
    
    // Verificar se o horário está dentro dos horários de funcionamento
    const dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
// Correção para lidar com inconsistências
const dayOfWeekMap = {
  "Sunday": "Domingo",
  "Monday": "Segunda-feira",
  "Tuesday": "Terça-feira",
  "Wednesday": "Quarta-feira",
  "Thursday": "Quinta-feira",
  "Friday": "Sexta-feira",
  "Saturday": "Sábado"
};

const dayOfWeekCapitalized = capitalizeFirstLetter(
  dayOfWeekMap[dateObj.toLocaleDateString('en-US', { weekday: 'long' })]
);
    console.log(`Dia da semana capitalizado: ${dayOfWeekCapitalized}`);
    
    const operatingHours = court.operatingHours[capitalizeFirstLetter(dayOfWeek)];
    console.log(`Horários de funcionamento para ${dayOfWeekCapitalized}:`, operatingHours);
    
    if (!operatingHours) {
      console.log('Quadra fechada no dia selecionado:', dayOfWeekCapitalized);
      return res.status(400).json({ message: 'Quadra fechada no dia selecionado' });
    }

    // Verificar se o horário está dentro do horário de funcionamento
    if (time < operatingHours.open || time >= operatingHours.close) {
      console.log(`Horário selecionado (${time}) fora dos horários de funcionamento (${operatingHours.open} - ${operatingHours.close})`);
      return res.status(400).json({ message: 'Horário fora dos horários de funcionamento da quadra' });
    }

    // Verificar disponibilidade
    const existingReservations = await Reservation.find({
      court: courtId,
      date: date,
      time: time,
    });
    
    console.log(`Reservas existentes para ${date} às ${time}:`, existingReservations);
    
    if (existingReservations.length > 0) {
      console.log('Horário não disponível:', time);
      return res.status(400).json({ message: 'Horário não disponível' });
    }
    
    // Verificar se o usuário está autenticado
    if (!req.user || !req.user._id) {
      console.log('Usuário não autenticado.');
      return res.status(401).json({ message: 'Usuário não autenticado.' });
    }
    
    const reservation = new Reservation({
      user: req.user._id,
      court: courtId,
      sport,
      date: dateObj, // Usar objeto Date local
      time,
      recurrence,
=======
  console.log('Recebendo dados da reserva:', req.body);
  
  const { courtId, sport, date, time, paymentMethod, status } = req.body;
  
  try {
    // Verificar se todos os campos necessários estão presentes
    if (!courtId || !sport || !date || !time || !paymentMethod) {
      return res.status(400).json({ 
        message: 'Todos os campos são obrigatórios',
        receivedData: req.body
      });
    }

    // Verificar se a quadra existe
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ message: 'Quadra não encontrada' });
    }

    // Verificar se o usuário está autenticado
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    // Verificar se já existe uma reserva para este horário
    const existingReservation = await Reservation.findOne({
      court: courtId,
      date: date,
      time: time,
      status: { $ne: 'cancelled' } // Ignora reservas canceladas
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'Horário já reservado' });
    }

    // Criar a nova reserva
    const newReservation = new Reservation({
      user: req.user._id,
      court: courtId,
      sport,
      date,
      time,
>>>>>>> Stashed changes
      paymentMethod,
    });
<<<<<<< Updated upstream
    
    await reservation.save();
    console.log('Reserva criada com sucesso:', reservation);
    res.status(201).json(reservation);
    
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    
    // Verificar se é um erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'Erro ao criar reserva' });
=======

    // Salvar a reserva
    const savedReservation = await newReservation.save();

    // Retornar a reserva com dados populados
    const populatedReservation = await Reservation.findById(savedReservation._id)
      .populate('court', 'name')
      .populate('user', 'name email');

    console.log('Reserva criada com sucesso:', populatedReservation);

    res.status(201).json(populatedReservation);

  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ 
      message: 'Erro ao criar reserva',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
>>>>>>> Stashed changes
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
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
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