const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credentials: {
    type: { firstName: String, lastName: String },
    required: true,
  },
  password: { type: String, required: true },
  address: { type: String },
  orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
  transaction_history: [
    {
      type: {
        status: String,
        data: mongoose.Types.ObjectId,
      },
      ref: 'Product',
    },
  ],
  cart: mongoose.Types.ObjectId,
  my_products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
  followers: [{ type: mongoose.Types.ObjectId }],
  following: [{ type: mongoose.Types.ObjectId }],
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
