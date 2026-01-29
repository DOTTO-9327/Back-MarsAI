const express = require('express');
const router = express.Router();
const {
  getAllDirector,
  createDirector,
} = require('../controllers/director.controller');

router.get('/', getAllDirector);
router.post('/', createDirector);
module.exports = router;
