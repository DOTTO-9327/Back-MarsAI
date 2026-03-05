const emailService = require('../services/email.service');

const sendSimpleEmail = async (req, res) => {
  try {
    const { to, subject, text ,html} = req.body;

    
    await emailService.sendEmail({ to, subject, text ,html});

    res.status(200).json({ message: 'Email envoyé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
  }
};


module.exports = {
  sendSimpleEmail,
};
