const mongoose = require('mongoose');
const { hashPassword } = require('../../config/password');

const userSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  scores: [{ type: mongoose.Types.ObjectId, ref: 'Score' }],
});

userSchema.pre('save', async function () {
  this.password = await hashPassword(newUser.password);
});

module.exports = userSchema;
