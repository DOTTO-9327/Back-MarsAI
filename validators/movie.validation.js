const { body } = require('express-validator');

const movieValidation = [
  body('original_title').trim().notEmpty().withMessage('Titre original requis').isLength({ max: 255 }),
  body('english_title').trim().notEmpty().withMessage('Titre anglais requis').isLength({ max: 255 }),
  body('original_language')
    .notEmpty()
    .isIn(['Français', 'Anglais', 'FR', 'EN']),
  body('duration').notEmpty().isInt({ min: 1, max: 60 }).withMessage("La durée doit être entre 1 et 60 sec").toInt(),
  body('original_synopsis').trim().notEmpty().isLength({ min: 10, max: 1000 }),
  body('english_synopsis').trim().notEmpty().isLength({ min: 10, max: 1000 }),
];

module.exports = movieValidation;