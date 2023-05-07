const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  category: { type: String },
  description: { type: String },
  imgs: { type: [String] },
  quantity: { type: Number },
  price: { type: Number, required: true },
  marketPlace: { type: String, required: true },
  shipingDetails: {
    type: { height: Number, width: Number, depth: Number },
  },
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
