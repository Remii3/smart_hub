const { Schema, model } = require('mongoose');
const ShopDataSchema = new Schema({
  creatorData: {
    type: {
      _id: { type: Schema.Types.ObjectId, required: true },
      pseudonim: { type: String, required: true },
    },
    ref: 'User',
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  quantity: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  imgs: { type: [{ url: String, id: String }] },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  rating: {
    type: {
      avgRating: { type: Number },
      quantity: { type: Number },
    },
    default: {
      avgRating: 0,
      quantity: 0,
    },
  },
  authors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  marketplace: { type: String, enum: ['shop', 'collection'], required: true },
  sold: { type: Boolean, required: true, default: false },
  price: {
    type: {
      value: { type: Number, required: true },
      currency: { type: String, required: true, default: 'USD' },
    },
  },
  deleted: { type: Boolean, required: true, default: false },
  expireAt: { type: Date, expires: 0 },
});

const ShopDataModel = model('Product', ShopDataSchema);

module.exports = ShopDataModel;
