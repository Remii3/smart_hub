const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String },
  author: String,
  author_firstname: String,
  author_lastname: String,
  author_middlename: String,
  categories: String,
  volume: String,
  year: String,
  edition: String,
  language: String,
  extension: String,
  pages: String,
  filesize: String,
  md5: String,
  series: String,
  periodical: String,
  file_extension: String,
  url: String,
  convertTo: { type: {} },
  description: String,
  cover: String,
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
