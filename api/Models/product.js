const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  categories: [mongoose.Types.ObjectId],
  title: { type: String },
  description: String,
  price: Number,
  prodImg: String,
  quantity: { type: Number },
  shipingDetails: {
    type: { weight: Number, height: Number, width: Number, depth: Number },
  },
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
