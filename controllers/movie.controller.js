/**
 * movie.controller.js
 * -------------------
 * Contrôleur principal gérant le cycle de vie des films.
 */
const Movie = require('../models/movie.model');

/**
 * Récupère tous les films.
 */
const getAllMovie = async (req, res) => {
  try {
    const results = await Movie.findAll();

    // Vérification de la présence de données
    if (results.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Aucune Vidéo trouvée.',
      });
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(`❌ Erreur SQL getAllMovie: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de la récupération des films.`,
    });
  }
};

/**
 * Récupère les informations détaillées d'un film spécifique via son ID.
 */
const getMovieById = async (req, res) => {
  const { id } = req.params;

  // Sécurité : évite de lancer une requête si l'ID est mal formé ou nul
  if (!id || id === 'null') {
    return res.status(400).json({
      success: false,
      message: "L'identifiant du film est requis.",
    });
  }

  try {
    const results = await Movie.findById(id);

    if (results === null) {
      return res.status(404).json({
        success: true,
        message: 'Film introuvable',
      });
    }
    
    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(`❌ Erreur SQL getMovieById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Erreur serveur lors de la récupération du film.`,
    });
  }
};

/**
 * Enregistre un nouveau film en base de données.
 */
const createMovie = async (req, res) => {
  // Validation manuelle de la présence des champs obligatoires (en complément des validators)
  const requiredFields = [
    'original_title', 'english_title', 'submitted_at', 'youtube_url', 
    'cover_image', 'duration', 'is_hybrid', 'original_language', 
    'original_synopsis', 'english_synopsis', 'creative_process', 
    'ia_tools', 'hasSubs', 'status', 'director_id'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Champs manquants : ${missingFields.join(', ')}`,
    });
  }

  try {
    const results = await Movie.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Film créé avec succès",
      data: results,
    });
  } catch (error) {
    console.error(`❌ Erreur SQL createMovie: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: `Erreur lors de l'enregistrement du film.`,
    });
  }
};

/**
 * Met à jour le statut de modération d'un film.
 * Cette fonction utilise un mapping pour traduire les labels français du front 
 * vers les constantes ENUM de la base de données (PENDING, APPROVED, REJECTED).
 */
const updateMovieStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // OBJET DE MAPPING : Sécurité pour garantir l'intégrité des ENUM SQL
  const statusMap = {
    'EN ATTENTE': 'PENDING',
    'VALIDÉ': 'APPROVED',
    'REFUSÉ': 'REJECTED',
    'PENDING': 'PENDING',
    'APPROVED': 'APPROVED',
    'REJECTED': 'REJECTED'
  };

  const dbStatus = statusMap[status?.toUpperCase()];

  if (!dbStatus) {
    return res.status(400).json({ 
      success: false, 
      message: `Statut "${status}" non reconnu. Utilisez: EN ATTENTE, VALIDÉ ou REFUSÉ.` 
    });
  }

  try {
    const success = await Movie.updateStatus(id, dbStatus);
    
    if (!success) {
      return res.status(404).json({ 
        success: false, 
        message: "Film non trouvé ou aucune modification effectuée." 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: "Statut mis à jour avec succès.",
      newStatus: dbStatus 
    });
  } catch (error) {
    console.error(`❌ Erreur SQL updateMovieStatus: ${error.message}`);
    return res.status(500).json({ 
      success: false, 
      message: "Erreur serveur lors de la mise à jour du statut." 
    });
  }
};

module.exports = {
  getAllMovie,
  createMovie,
  getMovieById,
  updateMovieStatus
};