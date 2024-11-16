const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Não autorizado, token não encontrado' });
    }

    try {
      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscar usuário
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado' });
      }

      // Adicionar usuário à requisição
      req.user = user;
      next();
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      return res.status(401).json({ message: 'Token inválido' });
    }
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(500).json({ message: 'Erro no servidor' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso proibido, administrador necessário' });
  }
};

module.exports = { protect, admin };