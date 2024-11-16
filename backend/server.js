// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rotas
const userRoutes = require('./routes/userRoutes');
const courtRoutes = require('./routes/courtRoutes');

app.use('/api/courts', courtRoutes);
app.use('/api/users', userRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  });

console.log('MongoDB URI:', process.env.MONGODB_URI);

console.log('Variáveis de ambiente:', {
    MONGO_URI: process.env.MONGO_URI,
    MONGODB_URI: process.env.MONGODB_URI
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
