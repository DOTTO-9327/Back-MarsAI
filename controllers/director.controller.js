/**
 * director.controller.js
 * ----------------------
 * Contrôleur gérant les fiches des réalisateurs.
 * Assure la liaison entre les données personnelles des réalisateurs et leurs films.
 */
const Director = require('../models/director.model');

/**
 * Récupère la liste de tous les réalisateurs enregistrés.
 */
const getAllDirector = async (req, res) => {
  try {
    const results = await Director.findAll();
    res.status(200).json(results);
  } catch (error) {
    console.error('❌ Erreur Fetch All Directors:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur lors de la récupération des réalisateurs' 
    });
  }
};

/**
 * Gère la création d'un réalisateur avec vérification d'existence.
 * LOGIQUE : 
 * 1. Vérifie si l'email existe déjà.
 * 2. Si oui, retourne le profil existant (évite les erreurs de soumission multiple).
 * 3. Si non, crée une nouvelle entrée.
 */
const createDirector = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Vérification de l'unicité de l'email avant insertion
    const DirectorVerif = await Director.findByEmail(email);

    if (DirectorVerif) {
      return res.status(200).json({
        success: true,
        message: 'Réalisateur déjà existant dans la base de données',
        director: DirectorVerif,
      });
    }

    const newDirector = await Director.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Nouveau profil réalisateur créé avec succès',
      director: newDirector,
    });
  } catch (error) {
    console.error('❌ Erreur lors de la gestion du réalisateur:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la création ou de la récupération du profil' 
    });
  }
};

/**
 * Récupère les informations détaillées d'un réalisateur via son ID.
 */
const getDirectorById = async (req, res) => {
  try {
    const { id } = req.params;
    const director = await Director.findById(id);

    if (!director) {
      return res.status(404).json({ 
        success: false, 
        message: 'Réalisateur non trouvé' 
      });
    }

    res.status(200).json(director);
  } catch (error) {
    console.error('❌ Erreur Fetch Director By ID:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur serveur' 
    });
  }
};

/**
 * Met à jour les informations d'un réalisateur.
 */
const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;

    const isUpdated = await Director.update(id, req.body);

    if (!isUpdated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Impossible de mettre à jour : réalisateur non trouvé' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Profil mis à jour',
      data: { id, ...req.body } 
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la mise à jour du réalisateur' 
    });
  }
};

/**
 * Supprime un réalisateur de la base de données.
 */
const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await Director.deletes(id);
    
    if (!isDeleted) {
      return res.status(404).json({ 
        success: false, 
        message: 'Réalisateur non trouvé' 
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la suppression du réalisateur' 
    });
  }
};

module.exports = {
  getAllDirector,
  createDirector,
  getDirectorById,
  updateDirector,
  deleteDirector,
};