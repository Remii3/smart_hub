const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Types.ObjectId, ref: 'User' },
  products: [
    {
      type: {
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        inCartQuantity: Number,
        totalPrice: Number,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
