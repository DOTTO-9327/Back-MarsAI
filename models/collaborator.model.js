const db = require('../config/database');

const create = async collaborator => {
  const { firstname, lastname, contribution, movie_id } = collaborator;

  const sql = `
    INSERT INTO collaborator (
      firstname, lastname, contribution, movie_id
    ) VALUES (?, ?, ?, ?)`;

  const [result] = await db.query(sql, [
    firstname,
    lastname,
    contribution,
    movie_id,
  ]);

  return { id: result.insertId, ...collaborator };
};

module.exports = {
  create,
};