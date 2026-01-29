const express = require('express');
const router = express.Router();
const { getAllDirector, } = require('../controllers/director.controller');

router.get('/', getAllDirector);
module.exports = router;
