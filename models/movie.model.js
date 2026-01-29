
const db = require('../config/database');

const findAll = callback => {
  const sql = 'SELECT * FROM movie';
  db.query(sql, callback);
};

const create = (
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
  callback
) => {
  const sql =
    'INSERT INTO movie (original_title,english_title,submitted_at,youtube_url,cover_image,duration,is_hybrid,original_language,original_synopsis,english_synopsis,creative_process,ia_tools,hasSubs,status,director_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
  db.query(
    sql,
    [
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
    ],
    callback
  );
};

module.exports = {
  findAll,
  create,
};

