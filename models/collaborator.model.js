/**
 * collaborator.model.js
 * ---------------------
 * Modèle de données pour la gestion des collaborateurs.
 */
const db = require('../config/database');

/**
 * Récupère l'intégralité des collaborateurs présents en base de données.
 */
const findAll = async () => {
  const sql = 'SELECT * FROM collaborator';
  const [rows] = await db.query(sql);
  return rows;
};

/**
 * Récupère tous les membres de l'équipe associés à un film spécifique.
 */
const findByMovieId = async (movieId) => {
  const sql = 'SELECT * FROM collaborator WHERE movie_id = ?';
  const [rows] = await db.query(sql, [movieId]);
  return rows;
};

/**
 * Récupère un collaborateur spécifique par son identifiant unique.
 */
const findById = async (id) => {
  const sql = 'SELECT * FROM collaborator WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

/**
 * Crée une nouvelle entrée de collaborateur.
 */
const create = async (collaborator, connection = null) => {
  const { firstname, lastname, contribution, movie_id } = collaborator;

  const sql = `
    INSERT INTO collaborator (
      firstname, lastname, contribution, movie_id
    ) VALUES (?, ?, ?, ?)`;

  // Si une connexion de transaction est fournie, on l'utilise, sinon on utilise le pool classique.
  const conn = connection || db;

  try {
    const [result] = await conn.query(sql, [
      firstname,
      lastname || '', // Défaut à chaîne vide si le nom n'est pas renseigné
      contribution,
      movie_id
    ]);

    return { id: result.insertId, ...collaborator };
  } catch (error) {
    console.error("❌ Erreur SQL Collaborator:", error.message);
    throw error; 
  }
};

/**
 * Met à jour les informations d'un collaborateur existant.
 */
const update = async (id, collaborator) => {
  const { firstname, lastname, contribution } = collaborator;
  const sql = `
    UPDATE collaborator 
    SET firstname = ?, lastname = ?, contribution = ? 
    WHERE id = ?`;

  const [result] = await db.query(sql, [firstname, lastname, contribution, id]);
  return result.affectedRows > 0;
};

/**
 * Supprime un collaborateur de la base de données.
 */
const deletes = async (id) => {
  const sql = 'DELETE FROM collaborator WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = { 
  findAll, 
  findById, 
  findByMovieId, 
  create, 
  update, 
  deletes 
};