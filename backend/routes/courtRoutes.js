// backend/routes/courtRoutes.js
const express = require('express');
const router = express.Router();
const Court = require('../models/Court');
const {
  getCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} = require('../controllers/courtController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getBookedTimeSlots } = require('../controllers/reservationController');
const Reservation = require('../models/Reservation');
  
// Rotas públicas
router.get('/', async (req, res) => {
  try {
      console.log('Iniciando busca de quadras');
      const courts = await Court.find();
      console.log('Quadras encontradas:', courts);
      res.json(courts);
  } catch (error) {
      console.error('Erro detalhado ao buscar quadras:', error);
      res.status(500).json({ 
          message: 'Erro ao buscar quadra',
          error: error.message 
      });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: 'Quadra não encontrada' });
    }
    res.json(court);
  } catch (error) {
    console.error('Erro ao buscar quadra:', error);
    res.status(500).json({ message: 'Erro ao buscar quadra' });
  }
});

router.get('/:courtId/bookedSlots', async (req, res) => {
  try {
    const { courtId } = req.params;
    const { date } = req.query;
    
    console.log(`Buscando reservas para quadra ${courtId} na data ${date}`);

    const bookings = await Reservation.find({
      courtId: courtId,
      date: date
    });

    const bookedSlots = bookings.map(booking => booking.timeSlot);
    res.json(bookedSlots);
  } catch (error) {
    console.error('Erro ao buscar horários reservados:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rotas protegidas (admin)
router.post('/', protect, admin, createCourt);
router.put('/:id', protect, admin, updateCourt);
router.delete('/:id', protect, admin, deleteCourt);

module.exports = router;