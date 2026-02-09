const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const upload = require('../middlewares/uploadConfig');

// Route POST unique avec upload d'image
router.post('/', upload.single('cover_image'), submissionController.submitForm);

module.exports = router;