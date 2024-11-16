// backend/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createReservation,
  getReservations,
  updateReservation,
  deleteReservation
} = require('../controllers/reservationController');

// Criar reserva (protegida)
router.post('/', protect, createReservation);

// Outras rotas...
router.get('/', protect, getReservations);
router.put('/:id', protect, updateReservation);
router.delete('/:id', protect, deleteReservation);

module.exports = router;