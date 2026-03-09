/**
 * event.controller.js
 * -------------------
 * Contrôleur gérant les opérations CRUD pour les événements.
 */
const db = require('../config/database'); // Import de la connexion à la base de données pour les transactions
const Event = require('../models/event.model');

/**
 * Récupère tous les événements.
 */
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.findAll();
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des événements:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération des événements.' });
  }
};

/**
 * Récupère un événement par son ID.
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé.' });
    }

    res.status(200).json({ success: true, data: event });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'événement par ID:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la récupération de l\'événement.' });
  }
};

/**
 * Crée un nouvel événement.
 */
const createEvent = async (req, res) => {
  const connection = await db.getConnection(); // Obtenir une connexion pour la transaction
  try {
    await connection.beginTransaction(); // Démarrer la transaction

    const { 
        title, description, status, location, start_at, 
        total_capacity, price, registration_required 
    } = req.body;

    const newEvent = await Event.create({ 
        title, 
        description, 
        status, 
        location, 
        start_at, 
        registration_required 
    }, connection);

    const newSeat = await Event.createSeat({
      event_id: newEvent.id,
      total_capacity: total_capacity || 0,
      price: price || 0.00,
    }, connection);

    await connection.commit(); // Valider la transaction
    res.status(201).json({ success: true, message: 'Événement et sièges créés avec succès.', data: { event: newEvent, seat: newSeat } });
  } catch (error) {
    if (connection) await connection.rollback(); // Annuler la transaction en cas d'erreur
    console.error('❌ Erreur lors de la création de l\'événement:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création de l\'événement.' });
  } finally {
    if (connection) connection.release(); // Libérer la connexion
  }
};

/**
 * Met à jour un événement existant (Événement + Sièges).
 */
const updateEvent = async (req, res) => {
  const connection = await db.getConnection(); 
  try {
    await connection.beginTransaction();

    const { id } = req.params;
    const { 
        title, description, status, location, start_at, 
        registration_required, total_capacity, price 
    } = req.body;

    // 1. Mise à jour de la table `event`
    const sqlEvent = `
      UPDATE event 
      SET title = ?, description = ?, status = ?, location = ?, start_at = ?, registration_required = ?
      WHERE id = ?
    `;
    const [eventResult] = await connection.query(sqlEvent, [
        title, description, status, location, start_at, registration_required, id
    ]);

    if (eventResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Événement non trouvé.' });
    }

    // 2. Mise à jour des sièges dans `event_seat`
    await Event.createSeat({
      event_id: id,
      total_capacity: total_capacity || 0,
      price: price || 0.00
    }, connection);

    await connection.commit(); 
    res.status(200).json({ success: true, message: 'Événement et places mis à jour avec succès.' });

  } catch (error) {
    if (connection) await connection.rollback(); // En cas d'erreur, on annule tout
    console.error('❌ Erreur lors de la mise à jour de l\'événement:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la mise à jour.' });
  } finally {
    if (connection) connection.release();
  }
};

/**
 * Supprime un événement.
 */
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const isDeleted = await Event.deletes(id);

    if (!isDeleted) {
      return res.status(404).json({ success: false, message: 'Événement non trouvé.' });
    }

    res.status(200).json({ success: true, message: 'Événement supprimé avec succès.' });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'événement:', error.message);
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la suppression de l\'événement.' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};