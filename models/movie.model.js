const db = require('../config/database');

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

const findById = async id => {
  const sql = 'SELECT * FROM movie WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

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
      cover_image,video_local_path, duration, is_hybrid, original_language, 
      original_synopsis, english_synopsis, creative_process, 
      ia_tools, hasSubs, status, director_id
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

  const conn = connection || db; // Si pas de transaction, utilise le pool par défaut

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

module.exports = { findAll, create, findById };
