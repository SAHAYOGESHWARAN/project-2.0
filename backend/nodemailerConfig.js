const nodemailer = require('nodemailer');
const { EMAIL_HOST, EMAIL_USER, EMAIL_PASS } = require('./config');

const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: 587, // or 465 for SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

module.exports = transporter;
