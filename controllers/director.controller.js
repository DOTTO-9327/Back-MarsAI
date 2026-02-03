const Director = require('../models/director.model');
// --recupere toutes les donnee director
const getAllDirector = async (req, res) => {
  try {
    // On appelle la fonction du model
    const results = await Director.findAll();

    // On envoie la réponse JSON au client
    res.json(results);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// --cree un  director
const createDirector = async (req, res) => {
  try {
    // On envoie tout le corps de la requête (req.body) au modèle
    const newDirector = await Director.create(req.body);

    // Status 201 = "Created"
    res.status(201).json(newDirector);
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la création du réalisateur' });
  }
};



// --affiche un directors par id

const getDirectorById = async (req, res) => {
  try {
    const { id } = req.params; // On récupère l'ID passé dans l'URL
    const director = await Director.findById(id);

    if (!director) {
      return res.status(404).json({ message: 'Réalisateur non trouvé' });
    }

    res.json(director);
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
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

const deleteDirector = (req, res) => {
  const { id } = req.params;
  Director.deletes(id, (error, results) => {
    if (error) {
      console.error('❌ Erreur lors de la requête SQL:', error.message);
      return res.status(500).send('Erreur serveur');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Catégorie non supprimée');
    }
    res.status(204).send();
  });
};

module.exports = {
  getAllDirector,
  createDirector,
  getDirectorById,
  updateDirector,
  deleteDirector,
};
