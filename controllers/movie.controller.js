/**
 * movie.controller.js
 */

const db = require('../config/database');

// IMPORTS DES MODÈLES ET SERVICES
const Movie = require('../models/movie.model');
const Notification = require('../models/notification.model');
const Director = require('../models/director.model');
const { sendStatusEmail } = require('../services/email.service');
const { getPagination } = require('../services/pagination.service');

/**
 * Récupère tous les films avec pagination
 */
const getAllMovie = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const [results, totalCount] = await Promise.all([
      Movie.findAll(limit, offset),
      Movie.countAll() 
    ]);

    if (results.length === 0 && page > 1) {
      return res.status(404).json({ success: false, message: 'Page inexistante.' });
    }

    return res.status(200).json(getPagination(results, page, limit, totalCount));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


/**
 * Récupère un film par son ID (Utilisé par l'Admin)
 */
const getMovieById = async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'null') {
    return res.status(400).json({ success: false, message: "L'identifiant du film est requis." });
  }
  try {
    const results = await Movie.findById(id);
    if (!results) {
      return res.status(404).json({ success: true, message: 'Film introuvable' });
    }
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(`❌ Erreur SQL getMovieById: ${error.message}`);
    return res.status(500).json({ success: false, message: `Erreur serveur.` });
  }
};

/**
 * Récupère un film par son TOKEN UNIQUE (Utilisé par la page d'édition du réalisateur)
 */
const getMovieByToken = async (req, res) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ success: false, message: "Token requis." });

  try {
    const results = await Movie.findByToken(token);
    if (!results) {
      return res.status(404).json({ success: false, message: 'Lien de modification invalide ou expiré.' });
    }
    return res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error(`❌ Erreur SQL getMovieByToken: ${error.message}`);
    return res.status(500).json({ success: false, message: `Erreur serveur.` });
  }
};

/**
 * Mise à jour du statut (Approbation / Refus) avec notification Email via Template Mailjet
 */
const updateMovieStatus = async (req, res) => {
  const { id } = req.params;
  const { status, comment, userId } = req.body;

  const statusMap = {
    'EN ATTENTE': 'PENDING', 'VALIDÉ': 'APPROVED', 'REFUSÉ': 'REJECTED', 'À MODIFIER': 'CHANGES_REQUESTED',
    'PENDING': 'PENDING', 'APPROVED': 'APPROVED', 'REJECTED': 'REJECTED', 'CHANGES_REQUESTED': 'CHANGES_REQUESTED'
  };
  const dbStatus = statusMap[status?.toUpperCase()];

  if (!dbStatus) return res.status(400).json({ success: false, message: `Statut non reconnu.` });

  if ((dbStatus === 'REJECTED' || dbStatus === 'CHANGES_REQUESTED') && (!comment || comment.trim() === '')) {
    return res.status(400).json({ success: false, message: "Un motif est obligatoire." });
  }

  try {
    const movieToUpdate = await Movie.findById(id);
    if (!movieToUpdate) return res.status(404).json({ success: false, message: "Film non trouvé." });

    const success = await Movie.updateStatus(id, dbStatus);
    if (!success) return res.status(500).json({ success: false, message: "Erreur lors de la mise à jour." });

    if (comment && comment.trim() !== '') {
      await Notification.create(comment, userId || null, id);
    }

    const director = await Director.findById(movieToUpdate.director_id);

    // ENVOI DE L'EMAIL VIA MAILJET SI LE STATUT EST DIFFÉRENT DE "PENDING"
    if (director && director.email && dbStatus !== 'PENDING') {
      const name = director.firstname || 'Réalisateur/trice';

      sendStatusEmail({
        email: director.email,
        firstname: name,
        filmTitle: movieToUpdate.original_title,
        editToken: movieToUpdate.edit_token,
        status: dbStatus,
        comment: comment
      }).catch(err => console.error(`Échec email Mailjet :`, err.message));
    }

    return res.status(200).json({ success: true, message: "Statut mis à jour.", newStatus: dbStatus });

  } catch (error) {
    console.error(`Erreur SQL updateMovieStatus: ${error.message}`);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const createMovie = async (req, res) => { /* ... */ };

const getOfficialLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const [results, totalItems] = await Promise.all([
      Movie.getLeaderboard(limit, offset),
      Movie.countApproved()
    ]);

    const response = getPagination(results, page, limit, totalItems);
    return res.status(200).json(response);
  } catch (error) {
    console.error(`❌ Erreur Leaderboard: ${error.message}`);
    return res.status(500).json({ success: false, message: "Erreur lors du calcul du classement." });
  }
};

module.exports = {
  getAllMovie,
  createMovie,
  getMovieById,
  getMovieByToken,
  updateMovieStatus,
  getOfficialLeaderboard
};