const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token: String,
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // 1 hour expiration
});

module.exports = mongoose.model('Token', tokenSchema);
