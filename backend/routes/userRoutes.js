// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser, 
  login 
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Rotas públicas (por exemplo, login e registro)
const { register } = require('../controllers/authController');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Retornar usuário sem a senha
    const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email
    };

    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.post('/register', register);

// Rotas protegidas (apenas para administradores)
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser); // Criação de usuário (incluindo admins)

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Rota para obter dados do usuário autenticado
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password'); // Excluir a senha dos dados retornados
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar dados do usuário' });
  }
});

module.exports = router;