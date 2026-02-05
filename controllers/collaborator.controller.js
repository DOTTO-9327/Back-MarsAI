const Collaborator = require('../models/collaborator.model');


const createCollaborator = async (req, res) => {
  try {
 
    const newCollaborator = await Collaborator.create(req.body);


    res.status(201).json(newCollaborator);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la création du collaborateur' });
  }
};
module.exports = {
  createCollaborator,
};