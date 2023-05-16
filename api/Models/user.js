const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  credentials: {
    type: { firstName: String, lastName: String },
    required: true,
  },
  password: { type: String, required: true },
  addresses: { type: [String], required: false },
  cart: mongoose.Types.ObjectId,
  my_products: [{ type: mongoose.Schema.Types.ObjectId }],
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
