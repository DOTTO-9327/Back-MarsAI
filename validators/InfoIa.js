const { body } = require('express-validator');
const InfoIa = [
  
  body('classification')
  .notEmpty()
  .isIn(['Génération 100%', 'Production hybride']),
  
body("hasSubtitles")
  .toBoolean()
  .isBoolean()
  .custom(value => {
    if (!value) {
      throw new Error("Les sous-titres sont obligatoires");
    }
    return true;
  }),

    body('outil IA')
    .trim()
    .notEmpty().withMessage('Précisez la nature de lIA')
    .isLength({min: 2, max: 500}),

    body('processus créatif')
    .trim()
    .notEmpty().withMessage('Décrivez lintéraction humain-machine...')
    .isLength({min: 5, max: 500}),
  
];
module.exports = InfoIa;
