const Collaborator = require('../models/collaborator.model');

// GET /api/collaborators
const getAllCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.findAll();
    res.json(collaborators);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/collaborators/:id
const getCollaboratorById = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id);
    if (!collaborator) return res.status(404).json({ message: "Collaborateur non trouvé" });
    res.json(collaborator);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/collaborators
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

// PUT /api/collaborators/:id
const updateCollaborator = async (req, res) => {
  try {
    const success = await Collaborator.update(req.params.id, req.body);
    if (!success) return res.status(404).json({ message: "Collaborateur non trouvé" });
    res.json({ message: "Collaborateur mis à jour avec succès" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /api/collaborators/:id
const deleteCollaborator = async (req, res) => {
  try {
    const success = await Collaborator.deletes(req.params.id);
    if (!success) return res.status(404).json({ message: "Collaborateur non trouvé" });
    res.json({ message: "Collaborateur supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllCollaborators,
  getCollaboratorById,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator
}