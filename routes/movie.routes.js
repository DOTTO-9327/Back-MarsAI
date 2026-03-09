const express = require('express');
const router = express.Router();
const { 
  getAllMovie, 
  createMovie, 
  getMovieById, 
  updateMovieStatus, 
  getMovieByToken,
  getOfficialLeaderboard
} = require('../controllers/movie.controller');

router.get('/', getAllMovie);
router.post('/', createMovie);
router.get('/edit-access/:token', getMovieByToken); 
router.get('/leaderboard', getOfficialLeaderboard);
router.get('/:id', getMovieById);
router.patch('/:id/status', updateMovieStatus);

module.exports = router;