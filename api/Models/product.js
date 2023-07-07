const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
  userProp: { type: { email: String, id: String }, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: { value: Number, currency: String }, required: true },
  imgs: [{ type: String }],
  categories: [{ type: { value: String, label: String }, ref: 'Category' }],
  authors: [{ type: String, ref: 'Author' }],
  rating: { type: Number },
  quantity: { type: Number },
  marketPlace: { type: String, required: true },
  addedDate: { type: Date, required: true },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
