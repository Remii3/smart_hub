const mongoose = require("mongoose");
const CollectionSchema = new mongoose.Schema({
  creatorData: {
    type: {
      _id: { type: mongoose.Types.ObjectId, required: true },
      pseudonim: { type: String, required: true },
    },
    required: true,
    ref: "User",
  },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  imgs: { type: [{ id: { type: String, required: true }, url: String }] },
  categories: {
    type: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
      },
    ],
    default: [],
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
  products: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
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
