const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema(
  {
    score: { type: String, require: true },
    user_id: { type: mongoose.Types.ObjectId, require: true },
    game_id: { type: mongoose.Types.ObjectId, require: true },
  },
  {
    timestamps: true,
    collection: 'Score',
  }
);

const Score = mongoose.model('Score', scoreSchema, 'Score');

module.exports = Score;
