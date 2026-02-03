const { findAll } = require('../models/director.model');
const Movie = require('../models/movie.model');
// --recupere toutes les donnee movie
const getAllMovie = async (req, res) => {
  try {
    const results = await Movie.findAll(
      'name,original_title,\
      english_title,\
      youtube_url,\
      cover_image,duration,\
      is_hybrid,\
      original_language,\
      original_synopsis,\
      english_synopsis,\
      creative_process,\
      ia_tools,\
      hasSubs,\
      status,\
      director_id\
    '
    );

    console.log(results)

    if (results.length === 0) {
      return res.status(404).json({
        success: true,
        message: 'Aucune Vidéo trouvée.',
      });
    }
    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `❌ Erreur lors de la requête SQL: ${error.message}`,
    });
  }
};

const getMovieById = async (req, res) => {
  
  const id = null

  if (!id || id === "null") {
    return res.status(400).json({
      success: false,
      message: "L'identifiant du film est requis."
    });
  }

  try {
    const results = await Movie.findById(id);

    if (results === null) {
      return res.status(404).json({
        success: true,
        message: "Film introuvable"
      })
    } 
      return res.status(200).json({
      success: true,
      data: results,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: `❌ Erreur lors de la requête SQL: ${error.message}`,
    });
  }
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
  getMovieById,
};
