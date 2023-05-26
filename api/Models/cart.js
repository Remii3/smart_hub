const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  products: {
    type: [{ _id: mongoose.SchemaTypes.ObjectId, inCartQuantity: Number }],
  },
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
