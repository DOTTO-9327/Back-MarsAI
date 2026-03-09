const emailService = require('../services/email.service');
const { sendConfirmationEmail } = require('../services/email.service');

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
const postConfirmation = async (req, res) => {
  
  try {
    const { email, firstname, filmTitle } = req.body;

    if (!email || !firstname) {
      return res.status(400).json({ message: 'Données manquantes' });
    }

    await sendConfirmationEmail({ email, firstname, filmTitle });

    res.status(200).json({ message: 'Email envoyé !' });
  } catch (error) {
    console.error('Erreur Mailjet Controller:', error);
    res.status(500).json({ message: "Erreur lors de l'envoi de l'email" });
  }
};

module.exports = {
  sendSimpleEmail,
  postConfirmation,
};
