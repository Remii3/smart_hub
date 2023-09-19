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
    type: {
      votes: [
        { user: { type: mongoose.Types.ObjectId, ref: 'User' }, vote: Number },
      ],
      quantity: { likes: Number, dislikes: Number },
    },
    default: {
      votes: [],
      quantity: { likes: 0, dislikes: 0 },
    },
  },
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;
