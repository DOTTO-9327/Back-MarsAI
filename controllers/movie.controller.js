const Movie = require('../models/movie.model');

const getAllMovie = (req, res) => {
  Movie.findAll((error, results) => {
    if (error) {
      console.error('❌ Erreur lors de la requête SQL:', error.message);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
};
module.exports = {
  getAllMovie,
};
