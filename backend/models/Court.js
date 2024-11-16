// backend/models/Court.js
const mongoose = require('mongoose');

const OperatingHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    required: true,
  },
  close: {
    type: String,
    required: true,
  },
}, { _id: false }); // Desativa a criação automática de _id

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
    // Exemplo: { Segunda-feira: { open: "08:00", close: "22:00" }, ... }
    type: Map,
    of: OperatingHoursSchema,
    required: true,
  },
  availableDatesTimes: [{
    date: Date,
    times: [String], // Formato "HH:MM"
  }],
}, { timestamps: true });

module.exports = mongoose.model('Court', CourtSchema);