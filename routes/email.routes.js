const { Router } = require('express');
const { sendSimpleEmail } = require('../controllers/email.controller');

const router = Router();

router.post('/send', sendSimpleEmail);

module.exports = router;
