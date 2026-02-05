function fileSubmission(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'aucun fichier uploaded' });
    }
    res
      .status(200)
      .json({ message: 'Fichier uploaded avec success', file: req.file });
  } catch (error) {
    console.error(
      '❌ Error pendant la soumission de  fichier :',
      error.message
    );
    res
      .status(500)
      .json({ error: 'Erreur serveur pendant la soumission du fichier' });
  }
}

module.exports = {
  fileSubmission,
};
