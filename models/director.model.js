const db = require('../config/database');

const findAll = callback => {
  const sql = 'SELECT * FROM director';
  db.query(sql, callback);
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

// const update = (
//   firstname,
//   lastname,
//   email,
//   gender,
//   birthdate,
//   country,
//   city,
//   phone,
//   job,
//   facebook_url,
//   instagram_url,
//   youtube_url,
//   twitter_url,
//   id,
//   callback
// ) => {
//   const sql = `UPDATE director SET firstname =?,lastname =?,email =?,gender =?,birthdate =?,country =?,city =?,phone =?,job =?,facebook_url =?,instagram_url =?,youtube_url =?,twitter_url =?WHERE id =?`;
//   db.query(
//     sql,
//     [
//       firstname,
//       lastname,
//       email,
//       gender,
//       birthdate,
//       country,
//       city,
//       phone,
//       job,
//       facebook_url,
//       instagram_url,
//       youtube_url,
//       twitter_url,
//       id,
//     ],
//     callback
//   );
// };
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
  // Suppression de la virgule après twitter_url = ?
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
module.exports = {
  findAll,
  create,
  update,
};
