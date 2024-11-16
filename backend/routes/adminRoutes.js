// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Rota para obter estatísticas
router.get('/stats', protect, admin, getStats);

module.exports = router;