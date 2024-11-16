// backend/controllers/courtController.js
const Court = require('../models/Court');

// Obter todas as quadras
exports.getCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Obter quadra por ID
exports.getCourtById = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (court) {
      res.json(court);
    } else {
      res.status(404).json({ message: 'Quadra não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// Criar nova quadra (Admin)
exports.createCourt = async (req, res) => {
  const { name, mainPhoto, gallery, description, allowedSports, operatingHours } = req.body;
  
  try {
    const court = new Court({
      name,
      mainPhoto,
      gallery,
      description,
      allowedSports,
      operatingHours,
    });
    await court.save();
    res.status(201).json(court);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar quadra' });
  }
};

// Atualizar quadra (Admin)
exports.updateCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (court) {
      court.name = req.body.name || court.name;
      court.mainPhoto = req.body.mainPhoto || court.mainPhoto;
      court.gallery = req.body.gallery || court.gallery;
      court.description = req.body.description || court.description;
      court.allowedSports = req.body.allowedSports || court.allowedSports;
      court.operatingHours = req.body.operatingHours || court.operatingHours;
      
      const updatedCourt = await court.save();
      res.json(updatedCourt);
    } else {
      res.status(404).json({ message: 'Quadra não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar quadra' });
  }
};

// Deletar quadra (Admin)
exports.deleteCourt = async (req, res) => {
  try {// backend/controllers/courtController.js
    const Court = require('../models/Court');
    
    // Obter todas as quadras
    exports.getCourts = async (req, res) => {
      try {
        const courts = await Court.find();
        res.json(courts);
      } catch (error) {
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
      const { name, mainPhoto, gallery, description, allowedSports, operatingHours } = req.body;
      
      try {
        const court = new Court({
          name,
          mainPhoto,
          gallery,
          description,
          allowedSports,
          operatingHours,
        });
        await court.save();
        res.status(201).json(court);
      } catch (error) {
        res.status(500).json({ message: 'Erro ao criar quadra' });
      }
    };
    
    // Atualizar quadra (Admin)
    exports.updateCourt = async (req, res) => {
      try {
        const court = await Court.findById(req.params.id);
        if (court) {
          court.name = req.body.name || court.name;
          court.mainPhoto = req.body.mainPhoto || court.mainPhoto;
          court.gallery = req.body.gallery || court.gallery;
          court.description = req.body.description || court.description;
          court.allowedSports = req.body.allowedSports || court.allowedSports;
          court.operatingHours = req.body.operatingHours || court.operatingHours;
          
          const updatedCourt = await court.save();
          res.json(updatedCourt);
        } else {
          res.status(404).json({ message: 'Quadra não encontrada' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar quadra' });
      }
    };
    
    // Deletar quadra (Admin)
    exports.deleteCourt = async (req, res) => {
      try {
        const court = await Court.findById(req.params.id);
        if (court) {
          await court.remove();
          res.json({ message: 'Quadra removida' });
        } else {
          res.status(404).json({ message: 'Quadra não encontrada' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar quadra' });
      }
    };
    const court = await Court.findById(req.params.id);
    if (court) {
      await court.remove();
      res.json({ message: 'Quadra removida' });
    } else {
      res.status(404).json({ message: 'Quadra não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar quadra' });
  }
};