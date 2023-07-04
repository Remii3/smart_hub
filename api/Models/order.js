const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  owner: { type: mongoose.Types.ObjectId },
  buyer: { type: mongoose.Types.ObjectId },
  items: [{ type: { product: mongoose.Types.ObjectId, quantity: Number } }],
  createdAt: new Date(),
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
