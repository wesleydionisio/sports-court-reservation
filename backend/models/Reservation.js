// backend/models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  sport: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Formato 'HH:MM'
  recurrence: { type: String, default: 'nenhuma' },
  paymentMethod: { type: String, enum: ['pagamento_no_ato', 'cartao_credito', 'paypal'], required: true },
});

module.exports = mongoose.model('Reservation', reservationSchema);