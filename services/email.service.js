const { mailjet } = require('../config/mailjet.js');

const sendEmail = async ({ to, subject, text, html }) => {
  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER,
          Name: 'Mon App',
        },
        To: [{ Email: to }],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
      },
    ],
  });
};

const sendConfirmationEmail = async ({ email, firstname, filmTitle }) => {
  return mailjet.post('send', { version: 'v3.1' }).request({
    Messages: [
      {
        From: {
          Email: process.env.MAILJET_SENDER,

          Name: 'Festival Mars',
        },
        To: [{ Email: email, Name: firstname }],
        Subject: `Confirmation : ${filmTitle}`,
        HTMLPart: `
                        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                            <h2>Bonjour ${firstname},</h2>
                            <p>Nous confirmons la réception de votre dossier pour le film : <strong>${filmTitle}</strong>.</p>
                            <p>Notre équipe va l'étudier avec attention.</p>
                            <p>Cordialement,<br>L'équipe du Festival.</p>
                        </div>
                    `,
      },
    ],
  });
};

module.exports = {
  sendEmail,
  sendConfirmationEmail,
};
