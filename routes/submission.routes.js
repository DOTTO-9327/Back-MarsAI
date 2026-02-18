const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const upload = require('../middlewares/uploadConfig');
const createDirectorValidation = require('../validators/director.validator');
const { validate } = require('../middlewares/validate');

// Route POST unique avec upload d'image + video
router.post('/', 
  upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'video_file', maxCount: 1 }
  ]), createDirectorValidation, movieValidation, InfoIa, validate,
  submissionController.submitForm
);

module.exports = router;