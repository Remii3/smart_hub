const mongoose = require('mongoose');

const BidSchema = mongoose.Schema({
  product_id: { type: mongoose.Types.ObjectId, ref: 'Product' },
  last_bidder: { type: mongoose.Types.ObjectId, ref: 'User' },
  highest_bid: { type: Number },
});

const BidModel = mongoose.model('Bid', BidSchema);

module.exports = BidModel;
