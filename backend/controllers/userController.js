// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Obter todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclui a senha
    res.json(users);
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    res.status(500).json({ message: 'Erro ao obter usuários' });
  }
};

// Obter usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

// Criar novo usuário
exports.createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Usuário já existe' });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    
    await user.save();
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

// Atualizar usuário
exports.updateUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

// Deletar usuário
exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    await user.remove();
    res.json({ message: 'Usuário removido' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ message: 'Erro ao deletar usuário' });
  }
};

// Obter usuário logado
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Tentando conectar ao banco de dados...');
        // Buscar usuário pelo email
        const user = await User.findOne({ email });
        console.log('Resultado da busca:', user ? 'Usuário encontrado' : 'Usuário não encontrado');
        
        if (!user) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        // Criar objeto com dados do usuário (sem a senha)
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        // Aqui você pode gerar um token JWT se estiver usando autenticação por token
        res.json({ token: 'seu_token', user: userData });
    } catch (error) {
        console.error('Erro detalhado no login:', error.stack);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

