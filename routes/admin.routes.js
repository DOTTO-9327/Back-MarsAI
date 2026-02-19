const express = require('express');
const router = express.Router();
const { fetchAdminMovies, moderateMovie, addStaffMember, fetchStaff, distributeMovies, fetchJuryMovies, saveMovieRating } = require('../controllers/admin.controller');

// GET http://localhost:5000/api/admin/movies
// Récupère la liste pour le tableau du dashboard
router.get('/movies', fetchAdminMovies);

// PATCH http://localhost:5000/api/admin/movies/:id/status
// Action de modération (Valider/Refuser)
router.patch('/movies/:id/status', moderateMovie);

// POST http://localhost:5000/api/admin/staff
router.post('/staff', addStaffMember);

router.get('/staff', fetchStaff);

router.post('/distribute', distributeMovies);

// GET http://localhost:5000/api/admin/jury/:juryId/movies
router.get('/jury/:juryId/movies', fetchJuryMovies);

// PATCH http://localhost:5000/api/admin/rating/:ratingId
router.patch('/rating/:ratingId', saveMovieRating);

module.exports = router;