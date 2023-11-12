const { Schema, model } = require('mongoose');
const CollectionSchema = new Schema({
  creatorData: {
    type: {
      _id: { type: Schema.Types.ObjectId, required: true },
      pseudonim: { type: String, required: true },
      profileImg: { type: String },
    },
    ref: 'User',
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  quantity: { type: Number, required: true },
  rating: {
    type: { avgRating: { type: Number }, quantity: { type: Number } },
    default: { avgRating: 0, quantity: 0 },
  },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  sold: { type: Boolean, require: true, default: false },
  price: {
    type: {
      value: { type: Number, required: true },
      currency: { type: String, required: true, default: 'USD' },
    },
  },
  deleted: { type: Boolean, required: true, default: false },
  expireAt: { type: Date, expires: 0 },
});

const CollectionModel = model('Collection', CollectionSchema);

module.exports = CollectionModel;
