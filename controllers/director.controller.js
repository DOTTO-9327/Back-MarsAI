const Director = require('../models/director.model');
// --recupere toutes les donnee director
const getAllDirector = (req, res) => {
  Director.findAll((error, results) => {
    if (error) {
      console.error('❌ Erreur lors de la requête SQL:', error.message);
      return res.status(500).send('Erreur serveur');
    }
    res.json(results);
  });
};
// --cree un  director
const createDirector = (req, res) => {
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
  } = req.body;
  Director.create(
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
    (error, results) => {
      if (error) {
        console.error('❌ Erreur lors de la requête SQL:', error.message);
        return res.status(500).send('Erreur serveur');
      }
      res.status(201).json({
        id: results.insertId,
        firstname: firstname,
        lastname: lastname,
        email: email,
        gender: gender,
        birthdate: birthdate,
        country: country,
        city: city,
        phone: phone,
        job: job,
        facebook_url: facebook_url,
        instagram_url: instagram_url,
        youtube_url: youtube_url,
        twitter_url: twitter_url,
      });
    }
  );
};

// --modifier  un  director
const updateDirector = (req, res) => {
  const { id } = req.params;
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
  } = req.body;
  Director.update(
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
    (error, results) => {
      if (error) {
        console.error('❌ Erreur lors de la requête SQL:', error.message);
        return res.status(500).send('Erreur serveur');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('article non modifiée');
      }
      res.json({
        id: parseInt(id),
        firstname: firstname,
        lastname: lastname,
        email: email,
        gender: gender,
        birthdate: birthdate,
        country: country,
        city: city,
        phone: phone,
        job: job,
        facebook_url: facebook_url,
        instagram_url: instagram_url,
        youtube_url: youtube_url,
        twitter_url: twitter_url,
      });
    }
  );
};

module.exports = {
  getAllDirector,
  createDirector,
  updateDirector,
};
