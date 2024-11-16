// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  getUserByEmail, 
  createUser, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rotas públicas (por exemplo, login e registro)
const { loginUser, registerUser } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/register', registerUser);

// Rotas protegidas (apenas para administradores)
router.route('/')
  .get(protect, admin, getAllUsers)
  .post(protect, admin, createUser); // Criação de usuário (incluindo admins)

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;