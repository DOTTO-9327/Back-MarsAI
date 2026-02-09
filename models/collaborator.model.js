const db = require('../config/database');

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

module.exports = { create };