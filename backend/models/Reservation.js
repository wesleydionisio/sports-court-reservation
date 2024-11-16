// backend/models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  date: {
    type: String, // Formato YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // Formato HH:MM
    required: true,
  },
  recurrence: {
    type: String,
    enum: ['nenhuma', '1_mes', '2_meses', '3_meses'],
    default: 'nenhuma',
  },
  paymentMethod: {
    type: String,
    enum: ['pagamento_no_ato', 'cartao_credito', 'paypal'],
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reservation', reservationSchema);