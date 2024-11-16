// backend/routes/courtRoutes.js
const express = require('express');
const router = express.Router();
const {
  getCourts,
  getCourtById,
  createCourt,
  updateCourt,
  deleteCourt,
} = require('../controllers/courtController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getBookedTimeSlots } = require('../controllers/reservationController'); // Importe a função
  
// Rotas públicas
router.get('/', getCourts);
router.get('/:id', getCourtById);

// Rota para obter horários reservados para uma quadra em uma data específica
router.get('/:id/bookedSlots', protect, admin, getBookedTimeSlots);

// Rotas protegidas (admin)
router.post('/', protect, admin, createCourt);
router.put('/:id', protect, admin, updateCourt);
router.delete('/:id', protect, admin, deleteCourt);

module.exports = router;