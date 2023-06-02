const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    name: { type: String },
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
