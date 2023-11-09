const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  created_at: { type: Date, default: Date.now },
  title: { type: String, required: true },
  subtitle: { type: String },
  img: { type: { id: String, url: String } },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  content: { type: String },
  voting: {
    type: {
      votes: [{ userId: { type: mongoose.Types.ObjectId }, vote: String }],
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
