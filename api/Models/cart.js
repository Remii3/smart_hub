const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  products: [mongoose.SchemaTypes.ObjectId],
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
