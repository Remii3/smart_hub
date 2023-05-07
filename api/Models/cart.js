const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  products: [mongoose.SchemaTypes.ObjectId],
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
