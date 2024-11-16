// backend/server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');  
 

dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Rotas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courts', require('./routes/courtRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));

// Rota raiz
app.get('/', (req, res) => {
  res.send('API de Agendamento de Quadras Esportivas');
});

// Captura de erros de porta em uso
const PORT = process.env.PORT || 5005;

const server = app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Tratamento de erro: porta já em uso
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Erro: a porta ${PORT} já está em uso.`);
    process.exit(1); // Finaliza o processo
  } else {
    console.error('Erro desconhecido:', err);
    process.exit(1);
  }
});

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend/src/pages')));

// Rota para páginas
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/src/pages', 'home.html'));
});