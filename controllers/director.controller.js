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

module.exports = {
  getAllDirector,
};
