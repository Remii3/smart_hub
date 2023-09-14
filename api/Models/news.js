const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  title: { type: String, required: true },
  subtitle: { type: String },
  headImage: { type: String },
  content: { type: String },
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;
