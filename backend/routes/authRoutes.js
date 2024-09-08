const express = require('express');
const { register, verifyEmail, forgotPassword, resetPassword, login } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.get('/verify/:userId/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:userId/:token', resetPassword);
router.post('/login', login);

module.exports = router;
