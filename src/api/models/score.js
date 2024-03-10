const mongoose = require('mongoose');

const scoreSchema = mongoose.Schema(
  {
    game: { type: String, require: true },
    score: { type: String, require: true },
    user_id: { type: mongoose.Types.ObjectId, require: true },
  },
  {
    timestamps: true,
    collection: 'Score',
  }
);

module.exports = scoreSchema;
