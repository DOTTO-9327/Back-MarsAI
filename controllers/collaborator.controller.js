/**
 * collaborator.controller.js
 * -------------------------
 * Contrôleur gérant les membres de l'équipe technique et artistique des films.
 */
const Collaborator = require('../models/collaborator.model');

/**
 * Récupère la liste complète de tous les collaborateurs enregistrés.
 */
const getAllCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.findAll();
    res.status(200).json(collaborators);
  } catch (error) {
    console.error("Erreur Fetch All Collaborators:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la récupération des collaborateurs.",
      error: error.message 
    });
  }
};

/**
 * Récupère les détails d'un collaborateur spécifique par son identifiant unique.
 */
const getCollaboratorById = async (req, res) => {
  try {
    const collaborator = await Collaborator.findById(req.params.id);
    
    if (!collaborator) {
      return res.status(404).json({ 
        success: false, 
        message: "Collaborateur non trouvé." 
      });
    }
    
    res.status(200).json(collaborator);
  } catch (error) {
    console.error("Erreur Fetch Collaborator Detail:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Enregistre un nouveau collaborateur en base de données.
 */
const createCollaborator = async (req, res) => {
  try {
    const newCollaborator = await Collaborator.create(req.body);

    res.status(201).json({
      success: true,
      message: "Collaborateur créé avec succès.",
      data: newCollaborator
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la création du collaborateur en base de données.' 
    });
  }
};

/**
 * Met à jour les informations d'un collaborateur (Nom, rôle, etc.).
 * Effectue une vérification d'existence avant modification.
 */
const updateCollaborator = async (req, res) => {
  try {
    const success = await Collaborator.update(req.params.id, req.body);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: "Impossible de mettre à jour : collaborateur non trouvé." 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Collaborateur mis à jour avec succès." 
    });
  } catch (error) {
    console.error("Erreur Update Collaborator:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

/**
 * Supprime définitivement un collaborateur de la base de données.
 */
const deleteCollaborator = async (req, res) => {
  try {
    const success = await Collaborator.deletes(req.params.id);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: "Impossible de supprimer : collaborateur non trouvé." 
      });
    }
    
    res.status(200).json({ 
      success: true, 
      message: "Collaborateur supprimé du générique." 
    });
  } catch (error) {
    console.error("Erreur Delete Collaborator:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = {
  getAllCollaborators,
  getCollaboratorById,
  createCollaborator,
  updateCollaborator,
  deleteCollaborator
};