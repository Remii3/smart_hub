const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
  categories: [
    {
      type: {
        value: { type: String, required: true },
        label: { type: String, required: true },
        description: { type: String },
      },
    },
  ],
});

const CategoryModel = mongoose.model('Category', CategorySchema);

module.exports = CategoryModel;
