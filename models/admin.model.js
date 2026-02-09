const db = require('../config/database');

/**
 * Récupère la liste complète des films avec les informations réalisateurs
 * pour l'affichage dans le tableau du dashboard admin.
 */
const getAdminMovieList = async () => {
    const sql = `
    SELECT 
      m.id, 
      m.original_title, 
      m.status, 
      m.submitted_at, 
      m.youtube_url,
      m.duration,
      d.firstname AS director_firstname, 
      d.lastname AS director_lastname, 
      d.email AS director_email,
      d.country AS director_country
    FROM movie m
    JOIN director d ON m.director_id = d.id
    ORDER BY m.submitted_at DESC`;

    const [rows] = await db.query(sql);
    return rows;
};

/**
 * Met à jour le statut d'un film (Action de modération)
 */
const updateMovieStatus = async (id, status) => {
    const [result] = await db.query(
        'UPDATE movie SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};

module.exports = {
    getAdminMovieList,
    updateMovieStatus
};