const mongoose = require('mongoose');
const ShopDataSchema = mongoose.Schema({
  seller_data: {
    type: { _id: mongoose.Types.ObjectId, pseudonim: String },
    ref: 'User',
  },
  title: { type: String, required: true },
  description: { type: String },
  imgs: { type: [String] },
  categories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
  ],
  authors: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  rating: { type: Number },
  quantity: { type: Number, required: true },
  market_place: { type: String, enum: ['Shop', 'Auction'], required: true },
  created_at: { type: Date, required: true, default: Date.now },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  sold: { type: Boolean, default: false },
  currency: { type: String, default: 'EUR' },
  shop_info: {
    price: { type: mongoose.Types.Decimal128 },
  },
  auction_info: {
    starting_price: { type: mongoose.Types.Decimal128 },
    auction_end_date: { type: String },
  },
  deleted: { type: Boolean, required: true, default: false },
  expireAt: { type: Date, expires: 0 },
});

const ShopDataModel = mongoose.model('Product', ShopDataSchema);

module.exports = ShopDataModel;
