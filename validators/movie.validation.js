const { body } = require('express-validator');

const movieValidation = [

  body('original_title')
    .trim()
    .notEmpty().withMessage('Titre original requis')
    .isLength({ min: 2, max: 255 }),

  body('english_title')
    .trim()
    .notEmpty().withMessage('Titre anglais requis')
    .isLength({ min: 2, max: 255 }),

  body('original_language')
    .notEmpty()
    .isIn(['Français', 'Anglais']),

  body('duration')
    .notEmpty().withMessage("Durée requise")
    .isInt({ min: 1, max: 60 })
    .withMessage("La vidéo ne peut pas dépasser 60 secondes")
    .toInt(),

    body("movie_upload").custom((value, { req }) => {
  if (!req.file) {
    throw new Error("Dépôt de vidéo requis");
  }

  const allowedTypes = [
    "video/mp4",
    "video/quicktime"
  ];

  if (!allowedTypes.includes(req.file.mimetype)) {
    throw new Error("Formats autorisés : MP4 / MOV");
  }

  return true;
}),

  body('original_synopsis')
    .trim()
    .notEmpty().withMessage('Synopsis original requis')
    .isLength({ min: 10, max: 1000 }),

  body('english_synopsis')
    .trim()
    .notEmpty().withMessage('Synopsis anglais requis')
    .isLength({ min: 10, max: 1000 }),

  
];

module.exports = movieValidation;
