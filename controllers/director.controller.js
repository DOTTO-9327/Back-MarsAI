const Director = require('../models/director.model');

const getAllDirector = async (req, res) => {
  try {
 
    const results = await Director.findAll();

    res.json(results);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

const createDirector = async (req, res) => {
  try {
   
    const newDirector = await Director.create(req.body);

  
    res.status(201).json(newDirector);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la création du réalisateur' });
  }
};



const getDirectorById = async (req, res) => {
  try {
    const { id } = req.params; 
    const director = await Director.findById(id);

    if (!director) {
      return res.status(404).json({ message: 'Réalisateur non trouvé' });
    }

    res.json(director);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;

   
    const isUpdated = await Director.update(id, req.body);


    if (!isUpdated) {
      return res.status(404).json({ message: 'Réalisateur non trouvé' });
    }

  
    res.json({ id, ...req.body });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la mise à jour du réalisateur' });
  }
};



const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await Director.deletes(id);
     if (!isDeleted) {
      return res.status(404).json({ message: 'Réalisateur non trouvé' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la suppression du réalisateur' });
  }
};
module.exports = {
  getAllDirector,
  createDirector,
  getDirectorById,
  updateDirector,
  deleteDirector,
};
