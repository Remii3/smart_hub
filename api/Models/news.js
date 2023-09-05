const mongoose = require('mongoose');

const NewsSchema = mongoose.Schema({
  created_at: { type: Date, default: Date.now },
  title: { type: String, required: true },
  short_description: { type: String },
  content: { type: String },
});

const NewsModel = mongoose.model('News', NewsSchema);

module.exports = NewsModel;
