const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    imgs: { type: [String] },
    category: { type: mongoose.Types.ObjectId },
    authors: { type: [mongoose.Types.ObjectId] },
    rating: { type: Number },
    quantity: { type: Number },
    marketPlace: { type: String, required: true },
});

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
