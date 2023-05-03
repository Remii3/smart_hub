const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: { type: [String], required: false },
  cart: mongoose.Types.ObjectId,
  products: [{ id: mongoose.Types.ObjectId }],
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
