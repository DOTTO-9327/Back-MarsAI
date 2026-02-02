const express = require('express');
const router = express.Router();
const { getAllMovie, createMovie, getMovieById } = require('../controllers/movie.controller');

router.get('/', getAllMovie);
router.post('/', createMovie);
router.get('/:id', getMovieById);

module.exports = router;
