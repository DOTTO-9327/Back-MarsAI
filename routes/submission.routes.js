const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submission.controller');
const upload = require('../middlewares/uploadConfig');
const directorValidation = require('../validators/director.validator');
const movieValidation = require('../validators/movie.validation');
const infoIa = require('../validators/InfoIa');
const { validate } = require('../middlewares/validate');

router.post('/',
  upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'video_file', maxCount: 1 }
  ]),
  directorValidation,
  movieValidation,
  infoIa,
  validate,
  submissionController.submitForm
);

module.exports = router;