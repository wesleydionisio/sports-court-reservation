// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    try {
        // Lógica de registro aqui
        res.status(201).json({ message: 'Usuário registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar se o usuário existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Email ou senha inválidos' });
        }

        // Criar token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Enviar resposta sem a senha
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        res.json({
            user: userResponse,
            token
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = {
    register,
    login
};