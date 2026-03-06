const { Router } = require('express');
const {
  sendSimpleEmail,
  postConfirmation,
} = require('../controllers/email.controller');

const router = Router();

router.post('/send', sendSimpleEmail);
router.post('/send-confirmation', postConfirmation);

module.exports = router;
