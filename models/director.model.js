const db = require('../config/database');

// Dans votre fichier Model
const findAll = async () => {
  const sql = 'SELECT * FROM director';
  // On attend le résultat de la base de données
  const [rows] = await db.query(sql);
  return rows; // On renvoie les données trouvées
};




const create = (
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
  callback
) => {
  const sql =
    'INSERT INTO director(firstname,lastname,email,gender,birthdate,country,city, phone, job,facebook_url,instagram_url,youtube_url,twitter_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
    ],
    callback
  );
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
