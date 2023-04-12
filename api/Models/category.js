const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: String,
  description: String,
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
