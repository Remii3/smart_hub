const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  products: {
    type: [
      { productId: mongoose.SchemaTypes.ObjectId, inCartQuantity: Number },
    ],
  },
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
