const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const upload = require('../middlewares/uploadConfig');

// Route POST unique avec upload d'image + video
router.post('/', 
  upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'video_file', maxCount: 1 }
  ]), 
  submissionController.submitForm
);

module.exports = router;