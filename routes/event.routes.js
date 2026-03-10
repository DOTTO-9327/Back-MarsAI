const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/event.controller');

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', createEvent);
router.put('/:id', updateEvent); // Utilisation de PUT pour la mise à jour complète
router.delete('/:id', deleteEvent);

module.exports = router;