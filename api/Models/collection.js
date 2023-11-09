const mongoose = require("mongoose");
const CollectionSchema = mongoose.Schema({
  creatorData: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      pseudonim: { type: String, required: true },
    },
    ref: "User",
  },
  title: { type: String, required: true },
  description: { type: String },
  imgs: { type: [{ url: String }] },
  categories: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  authors: {
    type: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    required: true,
  },
  rating: {
    avgRating: { type: Number },
    rates: [
      {
        type: {
          value: Number,
          commentId: { type: mongoose.Types.ObjectId, ref: "Comment" },
          userId: { type: mongoose.Types.ObjectId, ref: "User" },
        },
      },
    ],
  },
  quantity: { type: Number, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
  comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  sold: { type: Boolean, require: true, default: false },
  price: {
    type: {
      value: { type: Number, required: true },
      currency: { type: String, required: true, default: "USD" },
    },
  },
  deleted: { type: Boolean, required: true, default: false },
  expireAt: { type: Date, expires: 0 },
});

const CollectionModel = mongoose.model("Collection", CollectionSchema);

module.exports = CollectionModel;
