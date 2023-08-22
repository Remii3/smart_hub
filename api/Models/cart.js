const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  products: [
    {
      type: { _id: mongoose.SchemaTypes.ObjectId, quantity: Number },
      ref: 'Product',
    },
  ],
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
