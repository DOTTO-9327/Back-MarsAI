/**
 * admin.controller.js
 * -------------------
 * Contrôleur gérant les logiques métier de l'administration du festival.
 */
const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');

/**
 * Récupère la liste globale des films pour le dashboard
 */
const fetchAdminMovies = async (req, res) => {
    try {
        const movies = await Admin.getAdminMovieList();
        res.status(200).json({
            success: true,
            count: movies.length,
            data: movies
        });
    } catch (error) {
        console.error("Erreur Admin List:", error.message);
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de la liste des films.",
            error: error.message
        });
    }
};

/**
 * Met à jour le statut d'un film (Action de modération).
 * Attend 'PENDING', 'APPROVED' ou 'REJECTED' dans le body.
 */
const moderateMovie = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validation métier : On bloque toute valeur de statut non prévue par l'ENUM SQL.
    const authorizedStatus = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!authorizedStatus.includes(status)) {
        return res.status(400).json({ success: false, message: "Statut de modération invalide." });
    }

    try {
        const success = await Admin.updateMovieStatus(id, status);
        if (!success) {
            return res.status(404).json({ success: false, message: "Film non trouvé." });
        }

        res.status(200).json({
            success: true,
            message: `Le film ${id} a été passé en statut : ${status}`
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Crée un nouveau membre de l'équipe (Admin ou Jury).
 * TODO: Implémenter bcrypt.hash pour le password avant l'appel au modèle.
 */
const addStaffMember = async (req, res) => {
    try {
      const { mail, password, firstname, lastname, role } = req.body;

      //  Hachage du mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      await Admin.createStaffMember({
        mail,
        password: hashedPassword,
        firstname,
        lastname,
        roleName: role,
      });

      res
        .status(201)
        .json({ success: true, message: 'Membre ajouté avec succès !' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Récupère la liste des membres du jury avec leur état d'avancement.
 */
const fetchStaff = async (req, res) => {
    try {
        const staff = await Admin.getStaffList();
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * ALGORITHME DE RÉPARTITION (Workflow "Distribution Automatique")
 * -------------------------------------------------------------
 * Logique : Récupère les films validés et les jurés actifs.
 * Applique une méthode Round Robin pour que chaque film soit évalué par 2 personnes.
 */
const distributeMovies = async (req, res) => {
    try {
        const movies = await Admin.getApprovedMovieIds();
        const juries = await Admin.getJuryIds();

        // Sécurité : On empêche le calcul si les conditions minimales ne sont pas remplies.
        if (movies.length === 0) {
            return res.status(400).json({ success: false, message: "Aucun film n'est validé (APPROVED)." });
        }
        if (juries.length < 2) {
            return res.status(400).json({ success: false, message: "Il faut au moins 2 jurés pour la double évaluation." });
        }

        // Reset : On supprime les assignations précédentes non notées pour éviter les doublons.
        await Admin.clearPendingAssignments();

        let assignments = [];
        let currentJuryIndex = 0;

        // Boucle de distribution équitable.
        for (let i = 0; i < movies.length; i++) {
            const movieId = movies[i];

            // Assignation Juré A
            const jury1 = juries[currentJuryIndex % juries.length];
            currentJuryIndex++;

            // Assignation Juré B
            const jury2 = juries[currentJuryIndex % juries.length];
            currentJuryIndex++;

            assignments.push([jury1, movieId]);
            assignments.push([jury2, movieId]);
        }

        // Insertion groupée (Bulk) pour optimiser les performances BDD.
        const rowsInserted = await Admin.bulkInsertAssignments(assignments);

        res.status(200).json({
            success: true,
            message: `Distribution terminée : ${rowsInserted} assignations créées pour ${movies.length} films.`
        });

    } catch (error) {
        console.error("Erreur Distribution:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Récupère la file de visionnage spécifique d'un juré.
 */
const fetchJuryMovies = async (req, res) => {
    const { juryId } = req.params;
    try {
        const movies = await Admin.getJuryMovies(juryId);
        res.status(200).json({ success: true, data: movies });
    } catch (error) {
        console.error("Erreur Fetch Jury Movies:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

/**
 * Enregistre la note finale donnée par un juré.
 */
const saveMovieRating = async (req, res) => {
    const { ratingId } = req.params;
    const { note } = req.body;
    
    // Validation stricte du barème 0-10 défini dans le Cahier des Charges.
    if (note < 0 || note > 10) {
        return res.status(400).json({ success: false, message: "La note doit être comprise entre 0 et 10." });
    }

    try {
        await Admin.updateRating(ratingId, note);
        res.status(200).json({ success: true, message: "Note enregistrée avec succès." });
    } catch (error) {
        console.error("Erreur Save Rating:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    fetchAdminMovies,
    moderateMovie,
    addStaffMember,
    fetchStaff,
    distributeMovies,
    fetchJuryMovies,
    saveMovieRating
};