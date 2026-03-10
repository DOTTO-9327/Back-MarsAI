/**
 * event.model.js
 * --------------
 * Modèle gérant la persistance des événements avec distinction réservation/accès libre.
 */
const db = require('../config/database');

/**
 * Récupère l'ensemble des événements avec leurs informations de capacité (sièges).
 */
const findAll = async () => {
  const sql = `
    SELECT 
      e.*, 
      es.total_capacity, 
      es.price 
    FROM event e
    LEFT JOIN event_seat es ON e.id = es.event_id
    ORDER BY e.start_at ASC
  `;
  const [rows] = await db.query(sql);
  return rows;
};

/**
 * Récupère un événement précis via son identifiant (ID) avec ses détails de sièges.
 */
const findById = async (id) => {
  const sql = `
    SELECT 
      e.*, 
      es.total_capacity, 
      es.price 
    FROM event e
    LEFT JOIN event_seat es ON e.id = es.event_id
    WHERE e.id = ?
  `;
  const [rows] = await db.query(sql, [id]);
  return rows[0] || null;
};

/**
 * Crée un nouvel événement.
 * Ajout du champ registration_required (0 ou 1)
 */
const create = async (eventData, connection) => {
  const { title, description, status, location, start_at, registration_required } = eventData;
  const sql = `
    INSERT INTO event (title, description, status, location, start_at, registration_required) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  
  // Utilise la connexion de transaction si elle existe, sinon utilise le pool db standard
  const connector = connection || db;
  const [result] = await connector.query(sql, [
    title, 
    description, 
    status, 
    location, 
    start_at, 
    registration_required || 0 // Par défaut à 0 (accès libre)
  ]);
  
  return { id: result.insertId, ...eventData };
};

/**
 * Met à jour un événement existant.
 */
const update = async (id, eventData) => {
  const { title, description, status, location, start_at, registration_required } = eventData;
  const sql = `
    UPDATE event 
    SET title = ?, description = ?, status = ?, location = ?, start_at = ?, registration_required = ?
    WHERE id = ?
  `;
  const [result] = await db.query(sql, [
    title, 
    description, 
    status, 
    location, 
    start_at, 
    registration_required, 
    id
  ]);
  return result.affectedRows > 0;
};

/**
 * Supprime un événement.
 */
const deletes = async (id) => {
  const sql = 'DELETE FROM event WHERE id = ?';
  const [result] = await db.query(sql, [id]);
  return result.affectedRows > 0;
};

/**
 * Crée ou met à jour les informations de sièges.
 * Utilisé dans la transaction de création/édition.
 */
const createSeat = async (seatData, connection) => {
  const { event_id, total_capacity, price } = seatData;
  const sql = `
    INSERT INTO event_seat (event_id, total_capacity, price)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE total_capacity = VALUES(total_capacity), price = VALUES(price)
  `;
  const [result] = await connection.query(sql, [event_id, total_capacity, price]);
  return { id: result.insertId, ...seatData };
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deletes,
  createSeat,
};