const express = require('express');
const router = express.Router();
const {
  getAllDirector,
  createDirector,
  updateDirector,
  deleteDirector,
  getDirectorById,
} = require('../controllers/director.controller');

router.get('/', getAllDirector);
router.get('/:id', getDirectorById);
router.post('/', createDirector);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);
module.exports = router;
