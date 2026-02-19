const Admin = require('../models/admin.model');

const fetchAdminMovies = async (req, res) => {
    try {
        const movies = await Admin.getAdminMovieList();

        // On renvoie un succès même si la liste est vide (tableau vide côté Front)
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

const moderateMovie = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validation du statut
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

const addStaffMember = async (req, res) => {
    try {
        const { email, password, firstname, lastname, role } = req.body;
        // En production, il faudra hasher le mot de passe ici (ex: bcrypt)

        await Admin.createStaffMember({
            email, password, firstname, lastname, roleName: role
        });

        res.status(201).json({ success: true, message: "Membre ajouté avec succès !" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const fetchStaff = async (req, res) => {
    try {
        const staff = await Admin.getStaffList();
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Répartition des films pour les jurés
const distributeMovies = async (req, res) => {
    try {
        const movies = await Admin.getApprovedMovieIds();
        const juries = await Admin.getJuryIds();

        // Vérifications de sécurité
        if (movies.length === 0) {
            return res.status(400).json({ success: false, message: "Aucun film n'est validé (APPROVED)." });
        }
        if (juries.length < 2) {
            return res.status(400).json({ success: false, message: "Il faut au moins 2 jurés pour la double évaluation." });
        }

        // Nettoyage des anciennes distributions non notées
        await Admin.clearPendingAssignments();

        // Algorithme de distribution (Round Robin)
        let assignments = [];
        let currentJuryIndex = 0;

        // Pour chaque film, on assigne 2 jurés différents
        for (let i = 0; i < movies.length; i++) {
            const movieId = movies[i];

            // Premier juré
            const jury1 = juries[currentJuryIndex % juries.length];
            currentJuryIndex++;

            // Deuxième juré (il sera forcément différent car currentJuryIndex a avancé de 1)
            const jury2 = juries[currentJuryIndex % juries.length];
            currentJuryIndex++;

            // On prépare les données pour le Bulk Insert
            assignments.push([jury1, movieId]);
            assignments.push([jury2, movieId]);
        }

        // Insertion en base de données
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

module.exports = {
    fetchAdminMovies,
    moderateMovie,
    addStaffMember,
    fetchStaff,
    distributeMovies
};