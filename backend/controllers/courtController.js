// backend/controllers/courtController.js
const Court = require('../models/Court');

// Obter todas as quadras
exports.getCourts = async (req, res) => {
  try {
    console.log('Buscando todas as quadras...');
    const courts = await Court.find();
    res.json(courts);
  } catch (error) {
    console.error('Erro ao buscar quadras:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter quadra por ID
exports.getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: 'Quadra não encontrada' });
    }
    res.json(court);
  } catch (error) {
    console.error('Erro ao buscar quadra:', error);
    res.status(500).json({ message: 'Erro ao buscar a quadra' });
  }
};

// Criar nova quadra (Admin)
exports.createCourt = async (req, res) => {
  try {
    const { name, mainPhoto, gallery, description, allowedSports, operatingHours } = req.body;
    
    const court = new Court({
      name,
      mainPhoto,
      gallery,
      description,
      allowedSports,
      operatingHours,
    });

    const savedCourt = await court.save();
    console.log('Nova quadra criada:', savedCourt);
    res.status(201).json(savedCourt);
  } catch (error) {
    console.error('Erro ao criar quadra:', error);
    res.status(500).json({ 
      message: 'Erro ao criar quadra',
      error: error.message 
    });
  }
};

// Atualizar quadra (Admin)
exports.updateCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: 'Quadra não encontrada' });
    }

    const updateData = {
      name: req.body.name || court.name,
      mainPhoto: req.body.mainPhoto || court.mainPhoto,
      gallery: req.body.gallery || court.gallery,
      description: req.body.description || court.description,
      allowedSports: req.body.allowedSports || court.allowedSports,
      operatingHours: req.body.operatingHours || court.operatingHours,
    };

    const updatedCourt = await Court.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log('Quadra atualizada:', updatedCourt);
    res.json(updatedCourt);
  } catch (error) {
    console.error('Erro ao atualizar quadra:', error);
    res.status(500).json({ 
      message: 'Erro ao atualizar quadra',
      error: error.message 
    });
  }
};

// Deletar quadra (Admin)
exports.deleteCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: 'Quadra não encontrada' });
    }

    await Court.findByIdAndDelete(req.params.id);
    console.log('Quadra removida:', req.params.id);
    res.json({ message: 'Quadra removida com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar quadra:', error);
    res.status(500).json({ 
      message: 'Erro ao deletar quadra',
      error: error.message 
    });
  }
};