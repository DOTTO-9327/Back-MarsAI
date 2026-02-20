/**
 * movie.model.js
 * --------------
 * Modèle gérant la persistance des films.
 */
const db = require('../config/database');

/**
 * Récupère l'ensemble des films avec l'identité de leur réalisateur.
 */
const findAll = async () => {
  const sql = `
    SELECT 
      movie.*, 
      director.firstname, 
      director.lastname 
    FROM movie 
    LEFT JOIN director ON movie.director_id = director.id
  `;

  const [rows] = await db.query(sql);
  return rows;
};

/**
 * Récupère un film précis et les informations de son auteur via son identifiant.
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
 * Création d'un nouveau film.
 */
const create = async (movie, connection = null) => {
  const {
    original_title,
    english_title,
    submitted_at,
    youtube_url,
    cover_image,
    video_local_path,
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
  } = movie;

  const sql = `
    INSERT INTO movie (
      original_title, english_title, submitted_at, youtube_url, 
      cover_image, video_local_path, duration, is_hybrid, original_language, 
      original_synopsis, english_synopsis, creative_process, 
      ia_tools, hasSubs, status, director_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  // Priorité à la connexion de transaction si elle existe
  const conn = connection || db; 

  const [result] = await conn.query(sql, [
    original_title,
    english_title,
    submitted_at,
    youtube_url,
    cover_image,
    video_local_path,
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

module.exports = { findAll, create, findById, updateStatus };