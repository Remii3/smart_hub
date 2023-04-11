const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  authors: { type: [String] },
  categories: { type: [String] },
  volume: String,
  year: String,
  edition: String,
  language: String,
  pages: String,
  url: String,
  description: String,
  cover: String,
  price: Number,
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
