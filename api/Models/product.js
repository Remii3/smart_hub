const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  imgs: { type: [String] },
  categories: { type: [{ value: String, label: String }] },
  authors: { type: [String] },
  rating: { type: Number },
  quantity: { type: Number },
  marketPlace: { type: String, required: true },
  addedDate: { type: Date, required: true },
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
