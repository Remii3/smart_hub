const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  products: [
    {
      type: { _id: mongoose.SchemaTypes.ObjectId, quantity: Number },
      ref: "Product",
    },
  ],
});

const CartModel = mongoose.model("Cart", CartSchema);

module.exports = CartModel;
