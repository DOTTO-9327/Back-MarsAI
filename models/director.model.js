/**
 * director.model.js
 * -----------------
 * Modèle de données pour la gestion des réalisateurs.
 */
const db = require('../config/database');

/**
 * Récupère la liste complète des réalisateurs.
 */
const findAll = async () => {
  const sql = 'SELECT * FROM director';
  const [rows] = await db.query(sql);
  return rows;
};

/**
 * Recherche un réalisateur par son adresse email.
 */
const findByEmail = async (email, connection = null) => {
  const sql = 'SELECT * FROM director WHERE email = ?';
  // Utilise la connexion de transaction si elle est fournie, sinon utilise le pool par défaut
  const conn = connection || db; 
  const [rows] = await conn.query(sql, [email]);
  return rows[0] || null;
};

/**
 * Enregistre un nouveau réalisateur en base de données.
 */
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

  const conn = connection || db;

  const [result] = await conn.query(sql, [
    firstname, lastname, email, gender, birthdate,
    country, city, phone, job, facebook_url,
    instagram_url, youtube_url, twitter_url
  ]);

  return { id: result.insertId, ...director };
};

/**
 * Récupère un réalisateur par son ID.
 */
const findById = async id => {
  const sql = 'SELECT * FROM director WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

/**
 * Met à jour les informations d'un réalisateur.
 */
const update = async (id, director) => {
  // Actuellement en attente d'implémentation
  return true; 
};

/**
 * Supprime un profil réalisateur.
 */
const deletes = async id => {
  const sql = 'DELETE FROM director WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = { findAll, findByEmail, create, findById, update, deletes };