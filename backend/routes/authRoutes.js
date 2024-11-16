// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Rota para registrar
router.post('/register', register);

// Rota para login
router.post('/login', login);

module.exports = router;