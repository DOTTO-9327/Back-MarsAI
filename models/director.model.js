const db = require('../config/database');

const findAll = async () => {
  const sql = 'SELECT * FROM director';
  const [rows] = await db.query(sql);
  return rows;
};

// Accepte une connexion transactionnelle
const findByEmail = async (email, connection = null) => {
  const sql = 'SELECT * FROM director WHERE email = ?';
  const conn = connection || db; // Utilise la transaction si fournie, sinon le pool
  const [rows] = await conn.query(sql, [email]);
  return rows[0] || null;
};

// Accepte une connexion transactionnelle
const create = async (director, connection = null) => {
  const {
    firstname, lastname, email, gender, birthdate,
    country, city, phone, job, facebook_url,
    instagram_url, youtube_url, twitter_url
  } = director;

  const sql = `
    INSERT INTO director (
      firstname, lastname, email, gender, birthdate, 
      country, city, phone, job, facebook_url, 
      instagram_url, youtube_url, twitter_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const conn = connection || db; // Utilise la transaction si fournie

  const [result] = await conn.query(sql, [
    firstname, lastname, email, gender, birthdate,
    country, city, phone, job, facebook_url,
    instagram_url, youtube_url, twitter_url
  ]);

  return { id: result.insertId, ...director };
};

const findById = async id => {
  const sql = 'SELECT * FROM director WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

const update = async (id, director) => {
  return true; 
};

const deletes = async id => {
  const sql = 'DELETE FROM director WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findByEmail, create, findById, update, deletes };