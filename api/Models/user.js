const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  userInfo: {
    profileImg: { type: { id: String, url: String } },
    credentials: {
      type: { firstName: String, lastName: String },
      required: true,
    },
    address: {
      type: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
      },
    },
    phone: { type: String },
  },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  role: { type: String, default: 'User', enum: ['User', 'Author', 'Admin'] },
  securitySettings: {
    type: {
      hidePrivateInformation: Boolean,
    },
    default: { hidePrivateInformation: false },
  },
  authorInfo: {
    type: {
      pseudonim: { type: String },
      shortDescription: { type: String },
      quote: { type: String },
      followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
  },
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;
