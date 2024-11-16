// backend/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservation,
  deleteReservation,
  getBookedTimeSlots,
} = require('../controllers/reservationController');
const { protect, admin } = require('../middlewares/auth');

// Rotas protegidas
router.post('/', protect, createReservation);
router.get('/', protect, getReservations);
router.put('/:id', protect, updateReservation);
router.delete('/:id', protect, deleteReservation);

// Rota para obter horários reservados para uma quadra em uma data específica
router.get('/:id/bookedSlots', protect, getBookedTimeSlots);

module.exports = router;