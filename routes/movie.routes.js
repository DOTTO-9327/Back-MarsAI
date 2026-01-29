const express = require('express');
const router = express.Router();
const { getAllMovie, createMovie } = require('../controllers/movie.controller');

router.get('/', getAllMovie);
router.post('/', createMovie);
module.exports = router;
