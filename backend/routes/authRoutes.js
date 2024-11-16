// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rota para registrar
router.post('/register', authController.register);

// Rota para login
router.post('/auth/login', async (req, res) => {
  try {
    console.log('Tentativa de login:', req.body); // Debug
    const { email, password } = req.body;

    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuário não encontrado:', email); // Debug
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Senha inválida para:', email); // Debug
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login bem-sucedido para:', email); // Debug
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;