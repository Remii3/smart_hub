const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
  buyer_id: { type: mongoose.Types.ObjectId, ref: 'User' },
  products: [
    {
      type: {
        product: mongoose.Types.ObjectId,
        in_cart_quantity: Number,
        total_price: Number,
      },
      ref: 'Product',
    },
  ],
  created_at: { type: Date },
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
