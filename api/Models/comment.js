const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  product_id: { type: String, required: true },
  value: { type: { rating: Number, text: String } },
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
