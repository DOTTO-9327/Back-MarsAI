const db = require('../config/database');

/**
 * ============================================================
 * GESTION DES FILMS
 * ============================================================
 */

/**
 * Récupère la liste complète des films avec les informations réalisateurs.
 * Utilisé pour le tableau principal du Dashboard Admin.
 */
const getAdminMovieList = async () => {
    // Jointure obligatoire entre movie et director pour obtenir l'identité du soumetteur
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
 * Met à jour le statut d'un film (PENDING, APPROVED, REJECTED).
 */
const updateMovieStatus = async (id, status) => {
    const [result] = await db.query(
        'UPDATE movie SET status = ? WHERE id = ?',
        [status, id]
    );
    return result.affectedRows > 0;
};

/**
 * ============================================================
 * GESTION DU STAFF (ADMIN & JURY)
 * ============================================================
 */

// user par son mail
const findByEmail = async mail => {
  const sql = `
    SELECT u.*, r.name AS role 
    FROM user u
    LEFT JOIN role_user ru ON u.id = ru.user_id
    LEFT JOIN role r ON ru.role_id = r.id
    WHERE u.mail = ?`;

  const [rows] = await db.query(sql, [mail]);
  return rows; 
};
/**
 * Crée un utilisateur staff et lui lie un rôle via la table role_user.
 * Le mot de passe doit être hashé avant d'appeler cette fonction.
 */
const createStaffMember = async (userData) => {
    const { mail, password, firstname, lastname, roleName } =
      userData;

    // Insertion dans la table utilisateur
    const [userResult] = await db.query(
      'INSERT INTO user (mail, password, firstname, lastname) VALUES (?, ?, ?, ?)',
      [mail, password, firstname, lastname]
    );
    const userId = userResult.insertId;

    // Récupération de l'ID du rôle à partir de son nom (ADMIN/JURY)
    const [roleRows] = await db.query('SELECT id FROM role WHERE name = ?', [roleName]);
    if (roleRows.length === 0) throw new Error("Rôle inexistant");
    const roleId = roleRows[0].id;

    await db.query('INSERT INTO role_user (user_id, role_id) VALUES (?, ?)', [userId, roleId]);

    return userId;
};

/**
 * Récupère la liste des membres du staff avec statistiques de visionnage.
 */
const getStaffList = async () => {
    const sql = `
    SELECT 
      u.id, 
      u.firstname, 
      u.lastname, 
      r.name as role,
      -- Nombre total de films assignés (lignes dans la table rating)
      COUNT(rating.id) as total_assigned,
      -- Nombre de films déjà notés par le juré
      SUM(CASE WHEN rating.note IS NOT NULL THEN 1 ELSE 0 END) as current_progress
    FROM user u
    JOIN role_user ru ON u.id = ru.user_id
    JOIN role r ON ru.role_id = r.id
    LEFT JOIN rating ON u.id = rating.user_id
    WHERE r.name = 'JURY'
    GROUP BY u.id
    ORDER BY u.lastname ASC`;

    const [rows] = await db.query(sql);
    return rows;
};

/**
 * ============================================================
 * ALGORITHME DE DISTRIBUTION AUTOMATIQUE
 * ============================================================
 */

/**
 * Filtre les films éligibles au visionnage (uniquement ceux validés par l'admin).
 */
const getApprovedMovieIds = async () => {
    const [rows] = await db.query("SELECT id FROM movie WHERE status = 'APPROVED'");
    return rows.map(row => row.id);
};

/**
 * Récupère uniquement les IDs du staff habilité à noter (rôle JURY).
 */
const getJuryIds = async () => {
    const [rows] = await db.query(`
        SELECT u.id 
        FROM user u
        JOIN role_user ru ON u.id = ru.user_id
        JOIN role r ON ru.role_id = r.id
        WHERE r.name = 'JURY'
    `);
    return rows.map(row => row.id);
};

/**
 * Nettoie les anciennes assignations non traitées.
 * Permet de relancer l'algorithme de distribution sans créer de doublons.
 */
const clearPendingAssignments = async () => {
    await db.query("DELETE FROM rating WHERE note IS NULL");
};

/**
 * Insertion massive des paires [Juré, Film] dans la table rating.
 * Utilise la syntaxe optimisée de mysql2 pour les Bulk Inserts.
 */
const bulkInsertAssignments = async (assignments) => {
    if (assignments.length === 0) return 0;
    const [result] = await db.query(
        "INSERT INTO rating (user_id, movie_id) VALUES ?",
        [assignments]
    );
    return result.affectedRows;
};

/**
 * ============================================================
 * ESPACE JURY : VISIONNAGE ET NOTATION
 * ============================================================
 */

/**
 * Récupère la "Queue" (file d'attente) de films pour un juré spécifique.
 * Inclut les métadonnées pour le player vidéo et la gestion du statut "noté".
 */
const getJuryMovies = async (juryId) => {
    const sql = `
        SELECT 
            m.id as movie_id, 
            m.original_title as title, 
            m.cover_image as thumbnail, 
            m.video_local_path, -- Chemin vers le fichier mp4 sur le serveur
            m.original_language as country, 
            YEAR(m.submitted_at) as year,
            d.firstname, 
            d.lastname,
            r.note, -- La note peut être NULL (signifie 'À voir')
            r.id as rating_id
        FROM rating r
        JOIN movie m ON r.movie_id = m.id
        JOIN director d ON m.director_id = d.id
        WHERE r.user_id = ?
    `;
    const [rows] = await db.query(sql, [juryId]);
    return rows;
};

/**
 * Enregistre ou modifie la note d'un film.
 * La table 'rating' sert ici de table d'assignation ET de table de résultats.
 */
const updateRating = async (ratingId, note) => {
    const [result] = await db.query(
        "UPDATE rating SET note = ? WHERE id = ?", 
        [note, ratingId]
    );
    return result.affectedRows > 0;
};

module.exports = {
    getAdminMovieList,
    updateMovieStatus,
    createStaffMember,
    getStaffList,
    getApprovedMovieIds,
    getJuryIds,
    clearPendingAssignments,
    bulkInsertAssignments,
    getJuryMovies,
    findByEmail,
    updateRating
};