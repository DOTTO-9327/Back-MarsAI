const db = require('../config/database');

const findAll = async () => {
  const sql = 'SELECT * FROM director';

  const [rows] = await db.query(sql);
  return rows;
};

const create = async director => {
  const {
    firstname,
    lastname,
    email,
    gender,
    birthdate,
    country,
    city,
    phone,
    job,
    facebook_url,
    instagram_url,
    youtube_url,
    twitter_url,
  } = director;

  const sql = `
    INSERT INTO director (
      firstname, lastname, email, gender, birthdate, 
      country, city, phone, job, facebook_url, 
      instagram_url, youtube_url, twitter_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await db.query(sql, [
    firstname,
    lastname,
    email,
    gender,
    birthdate,
    country,
    city,
    phone,
    job,
    facebook_url,
    instagram_url,
    youtube_url,
    twitter_url,
  ]);

  return { id: result.insertId, ...director };
};

const findById = async id => {
  const sql = 'SELECT * FROM director WHERE id = ?';

  const [rows] = await db.query(sql, [id]);

  return rows[0] || null;
};

const update = async (id, director) => {
  const {
    firstname,
    lastname,
    email,
    gender,
    birthdate,
    country,
    city,
    phone,
    job,
    facebook_url,
    instagram_url,
    youtube_url,
    twitter_url,
  } = director;

  const sql = `
    UPDATE director 
    SET firstname = ?, lastname = ?, email = ?, gender = ?, birthdate = ?, 
        country = ?, city = ?, phone = ?, job = ?, facebook_url = ?, 
        instagram_url = ?, youtube_url = ?, twitter_url = ? 
    WHERE id = ?`;
  const [result] = await db.query(sql, [
    firstname,
    lastname,
    email,
    gender,
    birthdate,
    country,
    city,
    phone,
    job,
    facebook_url,
    instagram_url,
    youtube_url,
    twitter_url,
    id,
  ]);

  return result.affectedRows > 0;
};

const deletes = async id => {
  const sql = 'DELETE FROM director WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findAll,
  create,
  findById,
  update,
  deletes,
};
