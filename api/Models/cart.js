const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
  _id: { type: mongoose.SchemaTypes.ObjectId },
  products: [mongoose.Types.ObjectId],
  time: ISODate('date'),
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
