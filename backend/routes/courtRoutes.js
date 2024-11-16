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
const { protect, admin } = require('../middlewares/auth');

// Rotas públicas
router.get('/', getCourts);
router.get('/:id', getCourtById);

// Rotas protegidas (admin)
router.post('/', protect, admin, createCourt);
router.put('/:id', protect, admin, updateCourt);
router.delete('/:id', protect, admin, deleteCourt);

module.exports = router;