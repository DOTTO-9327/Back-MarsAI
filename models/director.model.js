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

const findById = async id => {
  const sql = 'SELECT * FROM director WHERE id = ?';

  // rows contiendra un tableau de résultats
  const [rows] = await db.query(sql, [id]);

  // On retourne le premier élément du tableau (l'objet director)
  // ou null si aucun n'est trouvé
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

  // On ajoute bien 'id' à la fin du tableau pour qu'il corresponde au dernier '?'
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

  // result.affectedRows permet de savoir si une ligne a bien été modifiée
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
