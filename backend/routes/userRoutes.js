// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Rotas públicas (por exemplo, login e registro)
const { login, register } = require('../controllers/authController');

router.post('/login', login);
router.post('/register', register);

// Rotas protegidas (apenas para administradores)
router.route('/')
  .get(protect, admin, getUsers)
  .post(protect, admin, createUser); // Criação de usuário (incluindo admins)

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;