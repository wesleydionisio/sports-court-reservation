// backend/models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['pagamento_no_ato', 'cartao_credito', 'paypal']
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'confirmed', 'cancelled']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reservation', reservationSchema);