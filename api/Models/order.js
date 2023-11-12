const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  buyer_id: { type: mongoose.Types.ObjectId, ref: 'User' },
  seller_id: { type: mongoose.Types.ObjectId, ref: 'User' },
  products: [
    {
      type: {
        product: { type: mongoose.Types.ObjectId, ref: 'Product' },
        in_cart_quantity: Number,
        total_price: Number,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
