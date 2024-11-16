// backend/controllers/adminController.js
const Reservation = require('../models/Reservation');
const Court = require('../models/Court');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const totalCourts = await Court.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReservations = await Reservation.countDocuments();
    
    res.json({
      totalCourts,
      totalUsers,
      totalReservations,
    });
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error);
    res.status(500).json({ message: 'Erro ao obter estatísticas' });
  }
};