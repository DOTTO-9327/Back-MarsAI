const { body } = require('express-validator');


const createDirectorValidation = [

  body('firstname')
    .trim()
    .notEmpty().withMessage('Prénom requis')
    .isLength({ min: 2, max: 100 }).withMessage('Ce champ doit contenir entre 2 et 100 caractères'),

  body('lastname')
    .trim()
    .notEmpty().withMessage('Nom requis')
    .isLength({ min: 2, max: 100 }),

  body('email')
    .trim()
    .notEmpty().withMessage('Email requis')
    .isEmail().withMessage("Format email invalide")
    .isLength({ max: 254 }),

  body('country')
    .trim()
    .notEmpty().withMessage('Pays requis')
    .isLength({ min: 2, max: 100 }),

  body('city')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }),

  body('job')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }),

  body('gender')
    .notEmpty().withMessage('Genre requis')
    .isIn(['M', 'F', 'OTHER']).withMessage('Genre invalide'),

  body('birthdate')
  .notEmpty().withMessage('Date requise')
    .isISO8601().withMessage('Date invalide')
    .toDate()
    .custom(value => {
      const today = new Date();
      const minAgeDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
      );

      if (value > minAgeDate) {
        throw new Error('Vous devez avoir au moins 18 ans');
      }

      return true;
    }),

  body('phone')
    .notEmpty().withMessage('Numéro requis')
    .isMobilePhone().withMessage('Numéro invalide'),

  body('facebook_url')
    .optional()
    .isURL({ protocols: ['https'], require_protocol: true })
.withMessage('URL Facebook invalide')
.isLength({ max: 255 }),

  body('instagram_url')
    .optional()
    .isURL({ protocols: ['https'], require_protocol: true })
.withMessage('URL instagram invalide')
.isLength({ max: 255 }),



  body('twitter_url')
    .optional()
   .isURL({ protocols: ['https'], require_protocol: true })
.withMessage('URL twitter invalide')
.isLength({ max: 255 }),



  body('youtube_url')
    .optional()
   .isURL({ protocols: ['https'], require_protocol: true })
.withMessage('URL youtube invalide')
.isLength({ max: 255 }),


  
];

module.exports = createDirectorValidation;
