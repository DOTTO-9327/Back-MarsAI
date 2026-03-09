const mailjet  = require('../config/mailjet.js');

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
        TemplateID: 7763577,
        TemplateLanguage: true,
        Variables: {
          "firstname": firstname,
          "filmTitle": filmTitle,
        },
      
      },
    ],
  });
};

module.exports = {
  sendEmail,
  sendConfirmationEmail,
};
