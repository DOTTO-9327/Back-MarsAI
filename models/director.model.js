const db = require('../config/database');

// Dans votre fichier Model
const findAll = async () => {
  const sql = 'SELECT * FROM director';
  // On attend le résultat de la base de données
  const [rows] = await db.query(sql);
  return rows; // On renvoie les données trouvées
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

  // Avec mysql2/promise, on récupère le résultat de l'insertion (souvent appelé 'result')
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

  // On retourne l'id généré pour pouvoir le renvoyer au client si besoin
  return { id: result.insertId, ...director };
};

const update = (
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
  callback
) => {
  const sql = `UPDATE director SET firstname = ?, lastname = ?, email = ?, gender = ?, birthdate = ?, country = ?, city = ?, phone = ?, job = ?, facebook_url = ?, instagram_url = ?, youtube_url = ?, twitter_url = ? WHERE id = ?`;

  db.query(
    sql,
    [
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
    ],
    callback
  );
};

const deletes = (id, callback) => {
  const sql = 'DELETE FROM director WHERE id = ?';
  db.query(sql, [id], callback);
};
module.exports = {
  findAll,
  create,
  update,
  deletes,
};
