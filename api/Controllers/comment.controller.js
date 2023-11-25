const { default: mongoose } = require("mongoose");
const Comment = require("../Models/comment");
const Product = require("../Models/product");
const News = require("../Models/news");
const calculateAvgRating = require("../helpers/calculate/calculateAvgRating");

const getAllComments = async (req, res) => {
  const { targetId } = req.query;

  if (!targetId) {
    return res.status(422).json({ message: "Provide comment target id" });
  }
  try {
    const data = await Comment.find({ "targetData._id": targetId })
      .sort({
        createdAt: -1,
      })
      .populate("creatorData");

    return res.status(200).json({ data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed fetching comments", error: err.message });
  }
};

const addOneComment = async (req, res) => {
  const { userId, targetData, value } = req.body;
  if (!userId) {
    return res.status(422).json({ message: "Provide user id" });
  }

  try {
    const createdAt = new Date().getTime();
    const _id = new mongoose.Types.ObjectId();
    await Comment.create({
      _id,
      creatorData: userId,
      targetData,
      value,
      createdAt,
      updatedAt: createdAt,
    });
    const comments = await Comment.find({
      "targetData._id": targetData._id,
    }).lean();

    switch (targetData.type) {
      case "Product": {
        const rating = calculateAvgRating(comments);
        await Product.updateOne({ _id: targetData._id }, { rating });
        break;
      }
      case "News": {
        const rating = calculateAvgRating(comments);
        await News.updateOne({ _id: targetData._id }, { rating });
        break;
      }
    }

    return res.status(201).json({ message: "Success" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed adding new comment", error: err.message });
  }
};

const deleteOneComment = async (req, res) => {
  const { commentId } = req.body;
  if (!commentId) {
    return res.status(422).json({ message: "Provide comment id" });
  }

  try {
    const commentData = await Comment.findOne({ _id: commentId });

    await Comment.deleteOne({ _id: commentId });

    const comments = await Comment.find({
      "targetData._id": commentId,
    }).lean();

    switch (commentData.targetData.type) {
      case "Product": {
        const rating = calculateAvgRating(comments);
        await Product.updateOne(
          { _id: commentData.targetData._id },
          { rating }
        );
        break;
      }
      case "News": {
        const rating = calculateAvgRating(comments);
        await News.updateOne({ _id: commentData.targetData._id }, { rating });
        break;
      }
    }

    return res.status(200).json({ message: "Success" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed deleting a comment", error: err.message });
  }
};

module.exports = { getAllComments, addOneComment, deleteOneComment };
