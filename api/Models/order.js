const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
    user: { type: mongoose.Types.ObjectId },
    items: { type: [{ product: mongoose.Types.ObjectId, quantity: Number }] },
    totalAmount: Number,
    createdAt: new Date(),
});

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;
