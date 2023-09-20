const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  target_id: { type: String, required: true },
  value: { type: { rating: Number, text: String } },
  target: { type: String },
  created_at: { type: Date, required: true },
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
