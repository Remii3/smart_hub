const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  user_info: {
    profile_img: { type: Buffer },
    profile_img_type: { type: String },
    background_img: { type: Buffer },
    background_img_type: { type: String },
    credentials: {
      type: { first_name: String, last_name: String, full_name: String },
      required: true,
    },
    address: {
      type: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postal_code: String,
        country: String,
      },
    },
    phone: { type: String },
  },
  cart: { type: mongoose.Types.ObjectId },
  following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }],
  role: { type: String, default: 'User', enum: ['User', 'Author', 'Admin'] },
  author_info: {
    type: {
      categories: [{ type: String }],
      pseudonim: { type: String },
      short_description: { type: String },
      quote: { type: String },
      avg_products_grade: { type: Number },
      sold_books_quantity: { type: Number },
      my_products: [{ type: mongoose.Types.ObjectId, ref: 'Product' }],
      followers: { type: Number },
    },
  },
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
