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

const submitForm = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const data = req.body;

    // Récupération des URLs Scaleway (Multer-S3 injecte .location)
    const coverUrl = req.files?.['cover_image']?.[0]?.location || null;
    const videoUrl = req.files?.['video_file']?.[0]?.location || null;

    if (!videoUrl) throw new Error("Le téléchargement de la vidéo sur S3 a échoué.");

    // 1. Gestion Réalisateur
    let directorId;
    const existingDirector = await Director.findByEmail(data.email, connection);
    
    if (existingDirector) {
      directorId = existingDirector.id;
    } else {
      const newDir = await Director.create({
        firstname: data.firstname, 
        lastname: data.lastname, 
        email: data.email,
        gender: data.gender, 
        birthdate: data.birthdate, 
        country: data.country,
        city: data.city, 
        phone: data.phone, 
        job: data.job,
        facebook_url: data.facebook_url, 
        instagram_url: data.instagram_url,
        youtube_url: data.youtube_url, 
        twitter_url: data.twitter_url
      }, connection);
      directorId = newDir.id;
    }

    // 2. Création du Film
    const movieData = {
      original_title: data.original_title,
      english_title: data.english_title,
      submitted_at: new Date(),
      youtube_url: `PENDING_${Date.now()}`,
      cover_image: coverUrl,
      video_local_path: videoUrl, // URL S3
      duration: parseInt(data.duration, 10),
      // On convertit la valeur reçue (0 ou 1) en entier pour la BDD
      is_hybrid: parseInt(data.is_hybrid, 10), 
      original_language: data.original_language,
      original_synopsis: data.original_synopsis,
      english_synopsis: data.english_synopsis,
      ia_tools: data.ia_tools,
      creative_process: data.creative_process,
      // On s'assure que hasSubs est bien un entier 0 ou 1
      hasSubs: (data.hasSubs === 'true' || data.hasSubs === true || data.hasSubs === '1' || data.hasSubs === 1) ? 1 : 0,
      status: 'PENDING',
      director_id: directorId
    };

    const movie = await Movie.create(movieData, connection);

    // 3. Gestion Équipe
    if (data.team) {
      // Sécurité : JSON.parse seulement si c'est une chaîne (FormData envoie souvent des strings)
      const team = typeof data.team === 'string' ? JSON.parse(data.team) : data.team;
      for (const m of team) {
        if (m.firstname) {
          await Collaborator.create({
            firstname: m.firstname, 
            lastname: m.lastname || '',
            contribution: m.role || m.contribution, 
            movie_id: movie.id
          }, connection);
        }
      }
    }

    // VALIDATION FINALE
    await connection.commit();
    res.status(201).json({ 
      success: true, 
      message: "Formulaire enregistré avec succès",
      movieId: movie.id, 
      videoUrl 
    });

  } catch (error) {
    // Si une étape échoue, on annule tout ce qui a été fait dans la transaction
    if (connection) await connection.rollback();
    console.error("Erreur Submission:", error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // Important : on libère la connexion pour le pool
    if (connection) connection.release();
  }
};

module.exports = { submitForm };