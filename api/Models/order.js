const mongoose = require('mongoose');
const { ProductSchema } = require('./product');

const OrderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Types.ObjectId, ref: 'User' },
  sellerId: { type: mongoose.Types.ObjectId, ref: 'User' },
  products: [
    {
      type: {
        product: ProductSchema,
        inCartQuantity: Number,
        totalPrice: Number,
      },
    },
  ],
  orderPrice: { type: Number && String },
  status: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
