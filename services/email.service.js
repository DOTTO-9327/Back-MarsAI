const mailjet = require('../config/mailjet.js');

const sendEmail = async ({ to, subject, text, html }) => {
  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER,
          Name: 'Festival Mars',
        },
        To: [{ Email: to }],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });
};

const sendConfirmationEmail = async ({ email, firstname, filmTitle, editToken }) => {
  // Construction du lien sécurisé
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const secureEditLink = `${frontendUrl}/edit/${editToken}`;

  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER,
          Name: 'Festival Mars',
        },
        To: [{ Email: email, Name: firstname }],
        Subject: `Confirmation : ${filmTitle}`,
        TemplateID: 7763577, 
        TemplateLanguage: true,
        Variables: {
          "firstname": firstname,
          "filmTitle": filmTitle,
          "editUrl": secureEditLink 
        },
      },
    ],
  });
};

// FONCTION POUR GÉRER L'ENVOI DES STATUTS
const sendStatusEmail = async ({ email, firstname, filmTitle, editToken, status, comment }) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const secureEditLink = `${frontendUrl}/edit/${editToken}`;

  let templateId;
  let subject;

  switch (status) {
    case 'APPROVED':
      templateId = 7819875; 
      subject = `Félicitations ! Votre film "${filmTitle}" est validé`;
      break;
    case 'REJECTED':
      templateId = 7819887; 
      subject = `Statut de votre film "${filmTitle}"`;
      break;
    case 'CHANGES_REQUESTED':
      templateId = 7819883; 
      subject = `Modifications requises pour votre film "${filmTitle}"`;
      break;
    default:
      return; 
  }

  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER,
          Name: 'Festival Mars',
        },
        To: [{ Email: email, Name: firstname }],
        Subject: subject,
        TemplateID: templateId,
        TemplateLanguage: true,
        Variables: {
          "firstname": firstname,
          "filmTitle": filmTitle,
          "editUrl": secureEditLink,
          "comment": comment || "Aucun commentaire supplémentaire."
        },
      },
    ],
  });
};

module.exports = {
  sendEmail,
  sendConfirmationEmail,
  sendStatusEmail 
};