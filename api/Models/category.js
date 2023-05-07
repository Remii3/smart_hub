const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  name: String,
  description: String,
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
