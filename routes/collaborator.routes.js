const express = require('express');
const router = express.Router();
const {
  createCollaborator,
} = require('../controllers/collaborator.controller');

router.post('/', createCollaborator);

module.exports = router;