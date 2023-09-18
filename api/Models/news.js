const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  title: { type: String, required: true },
  subtitle: { type: String },
  head_image: { type: String },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  content: { type: String },
  rating: {
    type: { liked: Number, disliked: Number },
    required: true,
    default: { liked: 0, disliked: 0 },
  },
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;
