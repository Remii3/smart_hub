const mongoose = require('mongoose');

const ShopDataSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  img: { type: Buffer },
  img_type: { type: String },
  categories: [
    {
      type: {
        _id: mongoose.Types.ObjectId,
      },
      ref: 'Category',
    },
  ],
  authors: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  rating: { type: Number },
  quantity: { type: Number, required: true },
  market_place: { type: String, enum: ['Shop', 'Auction'], required: true },
  created_at: { type: Date, required: true, default: Date.now },
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  currency: { type: String, default: 'EUR' },
  shop_info: {
    price: { type: mongoose.Types.Decimal128 },
  },
  auction_info: {
    starting_price: { type: mongoose.Types.Decimal128 },
    current_price: { type: mongoose.Types.Decimal128 },
    auction_end_date: { type: Date },
  },
});

const ShopDataModel = mongoose.model('Product', ShopDataSchema);

module.exports = ShopDataModel;
