/**
 * notification.model.js
 * ---------------------
 * Modèle gérant l'enregistrement des commentaires et motifs de décision.
 */
const db = require('../config/database');

const create = async (message, userId, movieId) => {
    const sql = `
        INSERT INTO notification (message, user_id, movie_id, created_at) 
        VALUES (?, ?, ?, NOW())
    `;
    const [result] = await db.query(sql, [message, userId, movieId]);
    return result.insertId;
};

const findByMovieId = async (movieId) => {
    const sql = `
        SELECT n.*, u.firstname, u.lastname, r.name as role
        FROM notification n
        LEFT JOIN user u ON n.user_id = u.id
        LEFT JOIN role_user ru ON u.id = ru.user_id
        LEFT JOIN role r ON ru.role_id = r.id
        WHERE n.movie_id = ?
        ORDER BY n.created_at DESC
    `;
    const [rows] = await db.query(sql, [movieId]);
    return rows;
};

module.exports = { create, findByMovieId };