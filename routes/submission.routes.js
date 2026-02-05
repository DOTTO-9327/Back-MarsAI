const express = require('express');
const router = express.Router();

const upload = require('../middlewares/uploadConfig');

const { fileSubmission } = require('../controllers/submission.controller');

router.post('/upload', upload, fileSubmission);

module.exports = router;
