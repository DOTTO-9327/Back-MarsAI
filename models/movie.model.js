const db = require('../config/database');

const findAll = async () => {
  const sql = 'SELECT * FROM movie';
  const [rows] = await db.query(sql);
  return rows;
};

const create = async (movie) => {
 

  const {
    original_title,
    english_title,
    submitted_at,
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
    director_id
  } = movie;

  const sql =
    'INSERT INTO movie (original_title, english_title, submitted_at, youtube_url, cover_image,duration, is_hybrid, original_language, original_synopsis, english_synopsis, creative_process,ia_tools, hasSubs, status, director_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

  const [rows] = await db.query(sql, [
    original_title,
    english_title,
    submitted_at,
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
  ]);
  return { id: rows.insertId, ...movie };
};

const findById = async id => {
  const sql = 'SELECT * FROM movie WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return [rows];
};

module.exports = {
  findAll,
  create,
  findById,
};
