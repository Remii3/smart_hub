const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  user_info: {
    profile_img: { type: { id: String, url: String } },
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
  cart: { type: Schema.Types.ObjectId },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  role: { type: String, default: 'User', enum: ['User', 'Author', 'Admin'] },
  security_settings: {
    type: {
      hide_private_information: Boolean,
    },
    default: { hide_private_information: false },
  },
  author_info: {
    type: {
      categories: [{ type: String }],
      pseudonim: { type: String },
      short_description: { type: String },
      quote: { type: String },
      avg_products_grade: { type: Number },
      sold_books_quantity: { type: Number },
      followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
  },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
