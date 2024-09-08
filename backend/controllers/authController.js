const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../nodemailerConfig');
const { JWT_SECRET } = require('../config');

// Register a new user and send verification email
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await new User({ username, email, password: hashedPassword });
  await user.save();

  const token = crypto.randomBytes(32).toString('hex');
  await new Token({ userId: user._id, token }).save();

  const url = `${process.env.BASE_URL}/api/auth/verify/${user._id}/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Verify Email',
    html: `<a href="${url}">Click here to verify your email</a>`,
  });

  res.send('Verification email sent.');
};

// Email verification
exports.verifyEmail = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(400).send('Invalid link.');

  const token = await Token.findOne({
    userId: req.params.userId,
    token: req.params.token,
  });

  if (!token) return res.status(400).send('Invalid link.');

  user.isVerified = true;
  await user.save();
  await token.delete();

  res.send('Email verified successfully.');
};

// Password Recovery
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User with given email doesn’t exist.');

  const token = crypto.randomBytes(32).toString('hex');
  await new Token({ userId: user._id, token }).save();

  const url = `${process.env.BASE_URL}/reset-password/${user._id}/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Reset Password',
    html: `<a href="${url}">Click here to reset your password</a>`,
  });

  res.send('Password reset link sent to your email account.');
};

// Reset password
exports.resetPassword = async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.status(400).send('Invalid link.');

  const token = await Token.findOne({
    userId: req.params.userId,
    token: req.params.token,
  });

  if (!token) return res.status(400).send('Invalid link.');

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  await user.save();
  await token.delete();

  res.send('Password reset successfully.');
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid credentials.');
  }

  if (!user.isVerified) {
    return res.status(400).send('Email not verified.');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.send('Logged in successfully.');
};
