const Collaborator = require('../models/collaborator.model');

// --cree un  director
const createCollaborator = async (req, res) => {
  try {
    // On envoie tout le corps de la requête (req.body) au modèle
    const newCollaborator = await Collaborator.create(req.body);

    // Status 201 = "Created"
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