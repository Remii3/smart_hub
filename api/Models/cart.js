const mongoose = require('mongoose');

const CartSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    items: {
        type: [{ _id: mongoose.SchemaTypes.ObjectId, quantity: Number }],
    },
});

const CartModel = mongoose.model('Cart', CartSchema);

module.exports = CartModel;
