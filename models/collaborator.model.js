const db = require('../config/database');

// Récupérer tous les collaborateurs
const findAll = async () => {
  const sql = 'SELECT * FROM collaborator';
  const [rows] = await db.query(sql);
  return rows;
};

// Récupérer les collaborateurs d'un film spécifique
const findByMovieId = async (movieId) => {
  const sql = 'SELECT * FROM collaborator WHERE movie_id = ?';
  const [rows] = await db.query(sql, [movieId]);
  return rows;
};

// Récupérer un collaborateur par son ID
const findById = async (id) => {
  const sql = 'SELECT * FROM collaborator WHERE id = ?';
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

// Créer un collaborateur
const create = async (collaborator, connection = null) => {
  const { firstname, lastname, contribution, movie_id } = collaborator;

  const sql = `
    INSERT INTO collaborator (
      firstname, lastname, contribution, movie_id
    ) VALUES (?, ?, ?, ?)`;

  const conn = connection || db;

  try {
    const [result] = await conn.query(sql, [
      firstname,
      lastname || '',
      contribution,
      movie_id
    ]);

    return { id: result.insertId, ...collaborator };
  } catch (error) {
    console.error("❌ Erreur SQL Collaborator:", error.message);
    throw error;
  }
};

// Mettre à jour un collaborateur
const update = async (id, collaborator) => {
  const { firstname, lastname, contribution } = collaborator;
  const sql = `
    UPDATE collaborator 
    SET firstname = ?, lastname = ?, contribution = ? 
    WHERE id = ?`;

  const [result] = await db.query(sql, [firstname, lastname, contribution, id]);
  return result.affectedRows > 0;
};

// Supprimer un collaborateur
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