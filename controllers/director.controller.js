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

const updateDirector = async (req, res) => {
  try {
    const { id } = req.params;

    // On appelle le modèle en passant l'ID séparément pour plus de clarté
    const isUpdated = await Director.update(id, req.body);

    // 1. On vérifie si la mise à jour a réellement eu lieu
    if (!isUpdated) {
      return res.status(404).json({ message: 'Réalisateur non trouvé' });
    }

    // 2. Si c'est bon, on renvoie les nouvelles données avec l'ID
    res.json({ id, ...req.body });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la mise à jour du réalisateur' });
  }
};
// --supprime  un  director


const deleteDirector = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await Director.deletes(id);
     if (!isDeleted) {
      return res.status(404).json({ message: 'Réalisateur non trouvé' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
    res
      .status(500)
      .json({ error: 'Erreur lors de la suppression du réalisateur' });
  }
};
module.exports = {
  getAllDirector,
  createDirector,
  getDirectorById,
  updateDirector,
  deleteDirector,
};
