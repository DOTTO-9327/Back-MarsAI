const express = require('express');
const router = express.Router();
const {
  getAllDirector,
  createDirector,
  updateDirector,
} = require('../controllers/director.controller');

router.get('/', getAllDirector);
router.post('/', createDirector);
router.put('/:id', updateDirector);
module.exports = router;
