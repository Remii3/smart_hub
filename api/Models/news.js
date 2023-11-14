const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  creatorData: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
      pseudonim: { type: String, required: true },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  title: { type: String, required: true },
  subtitle: { type: String },
  shortDescription: { type: String },
  img: { type: { id: String, url: String } },
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
