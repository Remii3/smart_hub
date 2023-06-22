const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  value: { type: String },
  label: { type: String },
  description: { type: String },
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
