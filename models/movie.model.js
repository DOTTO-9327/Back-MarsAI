const db = require('../config/database');

const findAll = callback => {
  const sql = 'SELECT * FROM movie';
  db.query(sql, callback);
};

module.exports = {
  findAll,
};
