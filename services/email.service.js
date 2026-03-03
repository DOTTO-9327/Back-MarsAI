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

module.exports = {
  sendEmail,
};
