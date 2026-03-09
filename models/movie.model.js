/**
 * movie.model.js
 * --------------
 * Modèle gérant la persistance des films.
 */
const db = require('../config/database');

/**
 * Récupère l'ensemble des films avec l'identité de leur réalisateur.
 */
const findAll = async (limit, offset) => {
  const sql = `
    SELECT 
      movie.*, 
      director.firstname, 
      director.lastname 
    FROM movie 
    LEFT JOIN director ON movie.director_id = director.id
    ORDER BY movie.id DESC -- TRI DU PLUS RÉCENT AU PLUS ANCIEN
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(sql, [limit, offset]);
  return rows;
};

/**
 * Récupère un film précis et les informations de son auteur via son identifiant (ID).
 */
const findById = async id => {
  const sql = `
    SELECT 
      movie.*, 
      director.firstname, 
      director.lastname 
    FROM movie 
    INNER JOIN director ON movie.director_id = director.id 
    WHERE movie.id = ?
  `;

  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

/**
 * Récupère un film précis via son TOKEN UNIQUE d'édition.
 */
const findByToken = async token => {
  const sql = `
    SELECT 
      movie.*, 
      director.firstname, 
      director.lastname,
      director.email,
      director.gender,
      director.birthdate,
      director.phone,
      director.country,
      director.city,
      director.job,
      director.facebook_url,
      director.instagram_url,
      director.twitter_url
    FROM movie 
    INNER JOIN director ON movie.director_id = director.id 
    WHERE movie.edit_token = ?
  `;

  const [rows] = await db.query(sql, [token]);
  return rows[0] || null;
};

/**
 * Création d'un nouveau film.
 */
const create = async (movie, connection = null) => {
  const {
    original_title, english_title, submitted_at, youtube_url, 
    cover_image, video_local_path, duration, is_hybrid, original_language, 
    original_synopsis, english_synopsis, creative_process, 
    ia_tools, hasSubs, status, director_id, edit_token
  } = movie;

  const sql = `
    INSERT INTO movie (
      original_title, english_title, submitted_at, youtube_url, 
      cover_image, video_local_path, duration, is_hybrid, original_language, 
      original_synopsis, english_synopsis, creative_process, 
      ia_tools, hasSubs, status, director_id, edit_token
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const conn = connection || db; 

  const [result] = await conn.query(sql, [
    original_title, english_title, submitted_at, youtube_url, 
    cover_image, video_local_path, duration, is_hybrid, original_language, 
    original_synopsis, english_synopsis, creative_process, 
    ia_tools, hasSubs, status, director_id, edit_token
  ]);

  return { id: result.insertId, ...movie };
};

/**
 * Mise à jour du statut de modération d'un film.
 */
const updateStatus = async (id, status) => {
  const sql = 'UPDATE movie SET status = ? WHERE id = ?';
  const [result] = await db.query(sql, [status, id]);
  return result.affectedRows > 0;
};

/**
 * Compte le nombre total de films en base de données.
 */
const countAll = async () => {
  const sql = 'SELECT COUNT(*) as total FROM movie';
  const [rows] = await db.query(sql);
  return rows[0].total; // Retourne juste le chiffre (ex: 145)
};

/**
 * Récupère le classement des films basés sur la moyenne des notes de la table 'rating'.
 */
const getLeaderboard = async (limit, offset) => {
  const sql = `
    SELECT 
      m.id,
      m.original_title as title,
      m.cover_image as thumbnail,
      m.original_language as country,
      m.ia_tools,
      d.firstname,
      d.lastname,
      ROUND(AVG(r.note), 1) as average,
      COUNT(r.id) as total_votes
    FROM movie m
    INNER JOIN director d ON m.director_id = d.id
    LEFT JOIN rating r ON m.id = r.movie_id
    WHERE m.status = 'APPROVED'
    GROUP BY m.id
    ORDER BY average DESC, total_votes DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await db.query(sql, [limit, offset]);
  return rows;
};

/**
 * Compte le nombre de films approuvés pour la pagination du leaderboard.
 */
const countApproved = async () => {
  const [rows] = await db.query("SELECT COUNT(*) as total FROM movie WHERE status = 'APPROVED'");
  return rows[0].total;
};

module.exports = { findAll, create, findById, findByToken, updateStatus, countAll, getLeaderboard, countApproved };