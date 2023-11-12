const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  products: [
    {
      type: { _id: mongoose.SchemaTypes.ObjectId, quantity: Number },
      ref: 'Product',
    },
  ],
  collections: [
    {
      type: { _id: mongoose.SchemaTypes.ObjectId, quantity: Number },
      ref: 'Collection',
    },
  ],
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
