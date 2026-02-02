const Movie = require('../models/movie.model');
// --recupere toutes les donnee movie
const getAllMovie = (req, res) => {
  Movie.findAll((error, results) => {
    if (error) {
      console.error('❌ Erreur lors de la requête SQL:', error.message);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
};
const getMovieById = (req, res) => {
  const { id } = req.params;
 Movie.findById(id, (error, results) => {
   if (error) {
     console.error('❌ Erreur lors de la requête SQL:', error.message);
     return res.status(500).send('Erreur serveur');
   }
   if (results.length === 0) {
     return res.status(404).send('VIDEO non trouvée');
   }
   res.json(results[0]);
 });
};  
// --cree un movie
const createMovie = (req, res) => {
  const {
    name,
    original_title,
    english_title,
    youtube_url,
    cover_image,
    duration,
    is_hybrid,
    original_language,
    original_synopsis,
    english_synopsis,
    creative_process,
    ia_tools,
    hasSubs,
    status,
    director_id,
  } = req.body;
  Movie.create(
    name,
    original_title,
    english_title,
    youtube_url,
    cover_image,
    duration,
    is_hybrid,
    original_language,
    original_synopsis,
    english_synopsis,
    creative_process,
    ia_tools,
    hasSubs,
    status,
    director_id,
    (error, results) => {
      if (error) {
        console.error('❌ Erreur lors de la requête SQL:', error.message);
        return res.status(500).send('Erreur serveur');
      }
      res.status(201).json({
        id: results.insertId,
        name: name,
        original_title: original_title,
        english_title: original_title,
        youtube_url: youtube_url,
        cover_image: cover_image,
        duration: duration,
        is_hybrid: is_hybrid,
        original_language: original_language,
        original_synopsis: original_synopsis,
        english_synopsis: english_synopsis,
        creative_process: creative_process,
        ia_tools: ia_tools,
        hasSubs: hasSubs,
        status: status,
        director_id: director_id,
      });
    }
  );
};
module.exports = {
  getAllMovie,
  createMovie,
  getMovieById
};
