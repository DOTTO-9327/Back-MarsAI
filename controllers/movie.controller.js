const Movie = require('../models/movie.model');
// --recupere toutes les donnee movie
const getAllMovie = async (req, res) => {
  try {
    const results = await Movie.findAll();

    // console.log(results);

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
  const { id } = req.params;

  if (!id || id === 'null') {
    return res.status(400).json({
      success: false,
      message: "L'identifiant du film est requis.",
    });
  }

  try {
    const results = await Movie.findById(id);

    if (results === null) {
      return res.status(404).json({
        success: true,
        message: 'Film introuvable',
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

// --cree un movie
const createMovie = async (req, res) => {
  if (
    !req.body.original_title ||
    !req.body.english_title ||
    !req.body.submitted_at ||
    !req.body.youtube_url ||
    !req.body.cover_image ||
    !req.body.duration ||
    !req.body.is_hybrid ||
    !req.body.original_language ||
    !req.body.original_synopsis ||
    !req.body.english_synopsis ||
    !req.body.creative_process ||
    !req.body.ia_tools ||
    !req.body.hasSubs ||
    !req.body.status ||
    !req.body.director_id
  ) {
    return res.status(400).json({
      success: false,
      message: `Un ou plusieurs champs sont manquants.`,
    });
  }

  try {
    const results = await Movie.create(req.body);

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

module.exports = {
  getAllMovie,
  createMovie,
  getMovieById,
};
