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

// Rotas API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courts', require('./routes/courtRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/users', require('./routes/userRoutes')); // Certifique-se de adicionar esta rota

// Rota raiz da API
app.get('/api', (req, res) => {
  res.send('API de Agendamento de Quadras Esportivas');
});

// Servir arquivos estáticos do frontend após build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Rota para todas as outras solicitações, servindo o React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
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

app.use('/api/admin', require('./routes/adminRoutes'));

app.use('/api/users', require('./routes/userRoutes'));
