const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  created_at: { type: Date, default: Date.now },
  title: { type: String, required: true },
  subtitle: { type: String },
  img: { type: String },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  content: { type: String },
  voting: {
    type: {
      votes: [
        { user: { type: mongoose.Types.ObjectId, ref: 'User' }, vote: Number },
      ],
      quantity: { like: Number, dislike: Number },
    },
    default: {
      votes: [],
      quantity: { like: 0, dislike: 0 },
    },
  },
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;
