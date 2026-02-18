const { body } = require('express-validator');

const createDirectorValidation = [
  body('firstname').trim().notEmpty().withMessage('Prénom requis').isLength({ min: 2, max: 100 }),
  body('lastname').trim().notEmpty().withMessage('Nom requis').isLength({ min: 2, max: 100 }),
  body('email').trim().notEmpty().isEmail().withMessage("Format email invalide"),
  body('country').trim().notEmpty().withMessage('Pays requis'),
  body('city').optional().trim().isLength({ max: 100 }),
  body('job').optional().trim().isLength({ max: 100 }),
  body('gender').notEmpty().isIn(['M', 'F', 'OTHER']).withMessage('Genre invalide'),
  body('birthdate').notEmpty().isISO8601().toDate().custom(value => {
      const today = new Date();
      const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
      if (value > minAgeDate) throw new Error('Vous devez avoir au moins 18 ans');
      return true;
    }),
  body('phone').notEmpty().withMessage('Numéro requis'),
  body('facebook_url')
    .optional({ checkFalsy: true }) // Permet de laisser le champ vide
    .isURL({ protocols: ['https'], require_protocol: true }).withMessage('URL Facebook invalide'),

  body('instagram_url')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['https'], require_protocol: true }).withMessage('URL Instagram invalide'),

  body('twitter_url')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['https'], require_protocol: true }).withMessage('URL Twitter invalide'),

  body('youtube_url')
    .optional({ checkFalsy: true })
    .isURL({ protocols: ['https'], require_protocol: true }).withMessage('URL Youtube invalide'),
];

module.exports = createDirectorValidation;