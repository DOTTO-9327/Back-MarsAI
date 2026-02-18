const { body } = require('express-validator');

const InfoIa = [
  // Accepte '0' ou '1' (venant du front-end)
  body('is_hybrid')
    .notEmpty().withMessage('Classification requise')
    .isIn(['0', '1', 0, 1]).withMessage('Format classification invalide'),

  body("hasSubs")
    .toBoolean()
    .isBoolean(),

  // Noms simplifiés sans espaces
  body('ia_tools')
    .trim()
    .notEmpty().withMessage('Précisez les outils IA utilisés')
    .isLength({ min: 2, max: 500 }),

  body('creative_process')
    .trim()
    .notEmpty().withMessage('Décrivez votre processus créatif')
    .isLength({ min: 5, max: 500 }),
];

module.exports = InfoIa;