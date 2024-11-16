// backend/routes/reservationRoutes.js
const express = require('express');
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservation,
  deleteReservation,
  getBookedTimeSlots
} = require('../controllers/reservationController');
const { protect } = require('../middlewares/authMiddleware');

// Rotas protegidas
router.route('/')
  .post(protect, createReservation)
  .get(protect, getReservations);

router.route('/:id')
  .put(protect, updateReservation)
  .delete(protect, deleteReservation);

router.get('/:id/bookedSlots', protect, getBookedTimeSlots);

module.exports = router;