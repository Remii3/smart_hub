const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  creatorData: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  targetData: {
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      required: true,
      enum: ["Product", "News"],
    },
  },
  value: { type: { rating: { type: Number }, text: { type: String } } },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const CommentModel = mongoose.model("Comment", CommentSchema);

module.exports = CommentModel;
