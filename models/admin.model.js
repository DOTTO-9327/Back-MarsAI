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

/**
 * Crée un nouvel utilisateur et lui assigne un rôle (ADMIN ou JURY)
 */
const createStaffMember = async (userData) => {
    const { email, password, firstname, lastname, roleName } = userData;

    const [userResult] = await db.query(
        'INSERT INTO user (mail, password, firstname, lastname) VALUES (?, ?, ?, ?)',
        [email, password, firstname, lastname]
    );
    const userId = userResult.insertId;

    const [roleRows] = await db.query('SELECT id FROM role WHERE name = ?', [roleName]);
    if (roleRows.length === 0) throw new Error("Rôle inexistant");
    const roleId = roleRows[0].id;

    await db.query('INSERT INTO role_user (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

    return userId;
};

/**
 * Récupère tous les utilisateurs avec leur rôle associé
 */
const getStaffList = async () => {
    const sql = `
    SELECT 
      u.id, 
      u.firstname, 
      u.lastname, 
      u.mail as email,
      r.name as role
    FROM user u
    JOIN role_user ru ON u.id = ru.user_id
    JOIN role r ON ru.role_id = r.id
    ORDER BY u.lastname ASC`;

    const [rows] = await db.query(sql);
    return rows;
};

module.exports = {
    getAdminMovieList,
    updateMovieStatus,
    createStaffMember,
    getStaffList
};