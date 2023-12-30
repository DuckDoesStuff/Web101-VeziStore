const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 15 * 60},
});

const Token = mongoose.model('Token', tokenSchema, 'token');
module.exports = Token;