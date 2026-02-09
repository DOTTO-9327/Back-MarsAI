/**
 * UTILISATION D'UNE TRANSACTION SQL
 * ---------------------------------------
 * La soumission du formulaire est une opération qui impacte 3 tables :
 * 1. director 
 * 2. movie 
 * 3. collaborator 
 * * SANS TRANSACTION : Si l'insertion du film ou de l'équipe échoue, on pourrait se retrouver 
 * avec un réalisateur créé "pour rien" en base de données.
 * * AVEC TRANSACTION : On garantit l'intégrité des données.
 * - Soit toutes les étapes réussissent et on valide (COMMIT).
 * - Soit une seule étape échoue et on annule tout le processus (ROLLBACK),
 * remettant la base de données dans son état initial.
 */

const db = require('../config/database');
const Director = require('../models/director.model');
const Movie = require('../models/movie.model');
const Collaborator = require('../models/collaborator.model');

// Importation future du service YouTube
// const youtubeService = require('../services/youtube.service');

const submitForm = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const data = req.body;

    // Récupération des fichiers
    const coverFile = req.files && req.files['cover_image'] ? req.files['cover_image'][0] : null;
    const videoFile = req.files && req.files['video_file'] ? req.files['video_file'][0] : null;

    console.log("Début soumission pour :", data.original_title);

    // --- GESTION DES CHEMINS ---
    const coverPath = coverFile ? coverFile.path.replace(/\\/g, "/") : null;
    const videoLocalPath = videoFile ? videoFile.path.replace(/\\/g, "/") : null;

    if (!videoLocalPath) {
      throw new Error("Le fichier vidéo est requis pour la soumission.");
    }

    // --- GESTION RÉALISATEUR ---
    // Vérifier si l'email existe déjà pour éviter les doublons dans la table 'director'
    let directorId;
    const existingDirector = await Director.findByEmail(data.email, connection);

    if (existingDirector) {
      // Si trouvé, on récupère l'ID existant
      directorId = existingDirector.id;
    } else {
      // Sinon, on crée une nouvelle entrée dans 'director'
      const newDirector = await Director.create({
        firstname: data.firstname, lastname: data.lastname,
        email: data.email, gender: data.gender, birthdate: data.birthdate,
        country: data.country, city: data.city, phone: data.phone,
        job: data.job, facebook_url: data.facebook_url,
        instagram_url: data.instagram_url, youtube_url: data.youtube_url,
        twitter_url: data.twitter_url
      }, connection);
      directorId = newDirector.id;
    }

    // --- CRÉATION DU FILM ---
    // Conversion des chaînes de caractères "true"/"false" issues du FormData en Booléens/Entiers (0 ou 1)
    const movieData = {
      original_title: data.original_title,
      english_title: data.english_title || data.original_title,
      submitted_at: new Date(),
      // L'URL YouTube est mise en attente (sera mise à jour par le service plus tard)
      youtube_url: `PENDING_${Date.now()}`,
      cover_image: coverPath,
      video_local_path: videoLocalPath,
      duration: parseInt(data.duration, 10) || 0,
      is_hybrid: (data.is_hybrid === 'true' || data.is_hybrid === '1') ? 1 : 0,
      original_language: data.original_language,
      original_synopsis: data.original_synopsis,
      english_synopsis: data.english_synopsis,
      creative_process: data.creative_process,
      ia_tools: data.ia_tools,
      hasSubs: (data.hasSubs === 'true' || data.hasSubs === '1') ? 1 : 0,
      status: 'PENDING',
      director_id: directorId
    };

    const createdMovie = await Movie.create(movieData, connection);
    const movieId = createdMovie.id;

    // --- GESTION DE L'ÉQUIPE ---
    if (data.team) {
      let teamMembers = typeof data.team === 'string' ? JSON.parse(data.team) : data.team;
      for (const member of teamMembers) {
        if (member.firstname) {
          await Collaborator.create({
            firstname: member.firstname,
            lastname: member.lastname || '',
            contribution: member.role || member.contribution,
            movie_id: movieId
          }, connection);
        }
      }
    }

    // VALIDATION DE LA TRANSACTION SQL
    await connection.commit();
    console.log("Transaction SQL réussie.");

    // --- APPEL AU SERVICE YOUTUBE (ASYNCHRONE) ---
    /**
     * @todo Créer le service YouTube API v3
     * Cet appel ne doit pas bloquer la réponse HTTP. Upload 
     * "en arrière-plan".
     * * youtubeService.uploadVideo({
     * filePath: videoLocalPath,
     * title: movieData.original_title,
     * description: movieData.original_synopsis,
     * movieId: movieId
     * });
     */
    console.log("Le fichier est prêt pour l'envoi vers YouTube (Service en attente).");

    res.status(201).json({
      success: true,
      message: "Soumission enregistrée. La vidéo sera traitée prochainement.",
      movieId
    });

  } catch (error) {
    // ANNULATION TOTALE EN CAS D'ERREUR
    // Si une seule étape échoue, on annule tout (le réalisateur, le film et l'équipe).
    // La base de données reste dans l'état exact où elle était avant le début.
    if (connection) await connection.rollback();
    console.error("Erreur et Rollback :", error.message);
    res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement", error: error.message });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { submitForm };