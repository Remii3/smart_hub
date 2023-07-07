const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  user: { type: String, required: true, ref: 'User' },
  productId: { type: String, required: true },
  value: { type: { rating: Number, comment: String } },
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;
