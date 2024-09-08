const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = require('./config');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

module.exports = transporter;
