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
  // OBTENIR UNE CONNEXION DU POOL
  const connection = await db.getConnection();

  try {
    // DÉMARRER LA TRANSACTION
    await connection.beginTransaction();

    const data = req.body;
    const file = req.file;

    console.log("Début de la transaction pour :", data.original_title);

    // --- GESTION DU FICHIER ---
    // Nettoyage du chemin de l'image pour le stockage en database 
    let coverPath = null;
    if (file) {
      coverPath = file.path.replace(/\\/g, "/");
    }

    // --- GESTION RÉALISATEUR (FIND OR CREATE) ---
    // Vérifier si l'email existe déjà pour éviter les doublons dans la table 'director'
    let directorId;
    const existingDirector = await Director.findByEmail(data.email, connection);

    if (existingDirector) {
      // Si trouvé, on récupère l'ID existant
      console.log("Réalisateur trouvé :", existingDirector.email);
      directorId = existingDirector.id;
    } else {
      console.log("Création d'un nouveau réalisateur...");
      // Sinon, on crée une nouvelle entrée dans 'director'
      const newDirector = await Director.create({
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
      directorId = newDirector.id;
    }

    // --- CRÉATION DU FILM ---
    // Conversion des chaînes de caractères "true"/"false" issues du FormData en Booléens/Entiers (0 ou 1)
    const isHybrid = data.is_hybrid === 'true' || data.is_hybrid === '1';
    const hasSubs = data.hasSubs === 'true' || data.hasSubs === '1';

    const movieData = {
      original_title: data.original_title,
      english_title: data.english_title || data.original_title,
      submitted_at: new Date(),
      youtube_url: data.youtube_url_movie || data.youtube_url_link,
      cover_image: coverPath,
      duration: parseInt(data.duration, 10) || 0,
      is_hybrid: isHybrid ? 1 : 0,
      original_language: data.original_language,
      original_synopsis: data.original_synopsis,
      english_synopsis: data.english_synopsis,
      creative_process: data.creative_process,
      ia_tools: data.ia_tools,
      hasSubs: hasSubs ? 1 : 0,
      status: 'PENDING',
      director_id: directorId
    };

    const createdMovie = await Movie.create(movieData, connection);
    const movieId = createdMovie.id;

    // --- GESTION DE L'ÉQUIPE (COLLABORATEURS) ---
    if (data.team) {
      let teamMembers = [];
      try {
        // Le FormData envoie le tableau team sous forme de String JSON, il faut le parser
        teamMembers = typeof data.team === 'string' ? JSON.parse(data.team) : data.team;
        console.log("👥 Membres de l'équipe à insérer :", teamMembers.length);
      } catch (e) {
        console.error("Erreur JSON team:", e.message);
        throw new Error("Format de l'équipe invalide"); 
      }

      // Boucle asynchrone pour insérer chaque membre un par un dans la table 'collaborator'
      for (const member of teamMembers) {
        console.log(`Adding member: ${member.firstname} as ${member.role || member.contribution}`);

        await Collaborator.create({
          firstname: member.firstname,
          lastname: member.lastname || '',
          contribution: member.role || member.contribution, 
          movie_id: movieId
        }, connection);
      }
    }

    // VALIDATION FINALE
    await connection.commit();
    console.log("Transaction réussie !");

    res.status(201).json({
      success: true,
      message: "Soumission enregistrée avec succès",
      movieId
    });

  } catch (error) {
    // ANNULATION TOTALE EN CAS D'ERREUR
    // Si une seule étape échoue, on annule tout (le réalisateur, le film et l'équipe).
    // La base de données reste dans l'état exact où elle était avant le début.
    if (connection) await connection.rollback();
    console.error("❌ Erreur de soumission, rollback effectué :", error.message);

    res.status(500).json({
      success: false,
      message: "Échec de l'enregistrement",
      error: error.message
    });

  } finally {
    // LIBÉRATION
    if (connection) connection.release();
  }
};

module.exports = { submitForm };