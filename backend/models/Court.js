// backend/models/Court.js
const mongoose = require('mongoose');

const CourtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mainPhoto: {
    type: String, // URL da foto
    required: true,
  },
  gallery: [String], // URLs das fotos
  description: {
    type: String,
    required: true,
  },
  allowedSports: [String],
  operatingHours: {
    // Exemplo: { Monday: { open: "08:00", close: "22:00" }, ... }
    type: Map,
    of: {
      open: String,
      close: String,
    },
    required: true,
  },
  availableDatesTimes: [{
    date: Date,
    times: [String], // Formato "HH:MM"
  }],
}, { timestamps: true });

module.exports = mongoose.model('Court', CourtSchema);