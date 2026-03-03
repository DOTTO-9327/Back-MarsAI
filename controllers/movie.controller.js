/**
 * movie.controller.js
 */
const Movie = require('../models/movie.model');
const Notification = require('../models/notification.model'); // Import du modèle notification

const getAllMovie = async (req, res) => {
  try {
    const results = await Movie.findAll();
    if (results.length === 0) {
      return res.status(404).json({ success: true, message: 'Aucune Vidéo trouvée.' });
    }
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(`❌ Erreur SQL getAllMovie: ${error.message}`);
    return res.status(500).json({ success: false, message: `Erreur lors de la récupération des films.` });
  }
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'null') {
    return res.status(400).json({ success: false, message: "L'identifiant du film est requis." });
  }
  try {
    const results = await Movie.findById(id);
    if (results === null) {
      return res.status(404).json({ success: true, message: 'Film introuvable' });
    }
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(`❌ Erreur SQL getMovieById: ${error.message}`);
    return res.status(500).json({ success: false, message: `Erreur serveur lors de la récupération du film.` });
  }
};

const createMovie = async (req, res) => {
  const requiredFields = [
    'original_title', 'english_title', 'submitted_at', 'youtube_url', 
    'cover_image', 'duration', 'is_hybrid', 'original_language', 
    'original_synopsis', 'english_synopsis', 'creative_process', 
    'ia_tools', 'hasSubs', 'status', 'director_id'
  ];
  const missingFields = requiredFields.filter(field => !req.body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({ success: false, message: `Champs manquants : ${missingFields.join(', ')}` });
  }
  try {
    const results = await Movie.create(req.body);
    return res.status(201).json({ success: true, message: "Film créé avec succès", data: results });
  } catch (error) {
    console.error(`❌ Erreur SQL createMovie: ${error.message}`);
    return res.status(500).json({ success: false, message: `Erreur lors de l'enregistrement du film.` });
  }
};

const updateMovieStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comment, userId } = req.body; 

  const statusMap = {
    'EN ATTENTE': 'PENDING',
    'VALIDÉ': 'APPROVED',
    'REFUSÉ': 'REJECTED',
    'À MODIFIER': 'CHANGES_REQUESTED', 
    'PENDING': 'PENDING',
    'APPROVED': 'APPROVED',
    'REJECTED': 'REJECTED',
    'CHANGES_REQUESTED': 'CHANGES_REQUESTED' 
  };

  const dbStatus = statusMap[status?.toUpperCase()];

  if (!dbStatus) {
    return res.status(400).json({ success: false, message: `Statut "${status}" non reconnu.` });
  }

  // SÉCURITÉ : Exiger un commentaire si refus ou demande de modif
  if ((dbStatus === 'REJECTED' || dbStatus === 'CHANGES_REQUESTED') && (!comment || comment.trim() === '')) {
    return res.status(400).json({ 
        success: false, 
        message: "Un motif / commentaire est obligatoire pour refuser ou demander des modifications." 
    });
  }

  try {
    const success = await Movie.updateStatus(id, dbStatus);
    
    if (!success) {
      return res.status(404).json({ success: false, message: "Film non trouvé." });
    }

    // ENREGISTREMENT DU COMMENTAIRE 
    if (comment && comment.trim() !== '') {
        await Notification.create(comment, userId || null, id);
        
        // TODO PLUS TARD: 
        // if (dbStatus === 'CHANGES_REQUESTED' || dbStatus === 'REJECTED') {
        //    sendEmailToDirector(movie.director_email, comment, dbStatus);
        // }
    }

    return res.status(200).json({ 
      success: true, 
      message: "Statut mis à jour avec succès.",
      newStatus: dbStatus 
    });
  } catch (error) {
    console.error(`❌ Erreur SQL updateMovieStatus: ${error.message}`);
    return res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour." });
  }
};

module.exports = { getAllMovie, createMovie, getMovieById, updateMovieStatus };