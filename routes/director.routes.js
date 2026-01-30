const express = require('express');
const router = express.Router();
const {
  getAllDirector,
  createDirector,
  updateDirector,
  deleteDirector,
} = require('../controllers/director.controller');

router.get('/', getAllDirector);
router.post('/', createDirector);
router.put('/:id', updateDirector);
router.delete('/:id', deleteDirector);
module.exports = router;
