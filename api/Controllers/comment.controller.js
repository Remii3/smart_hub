const { default: mongoose } = require('mongoose');
const Comment = require('../Models/comment');
const Product = require('../Models/product');
const News = require('../Models/news');
const User = require('../Models/user');

const getAllComments = async (req, res) => {
  const { targetId } = req.query;

  if (!targetId) {
    return res.status(422).json({ message: 'Provide comment target id' });
  }
  try {
    const data = await Comment.find({ target_id: targetId })
      .sort({
        created_at: -1,
      })
      .populate('user');

    return res.status(200).json({ data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching comments', error: err.message });
  }
};

const addOneComment = async (req, res) => {
  const { userId, targetId, value, target } = req.body;

  if (!userId) {
    return res.status(422).json({ message: "Provide user id" });
  }

  if (!targetId) {
    return res.status(422).json({ message: "Provide target id" });
  }

  try {
    const created_at = new Date().getTime();
    const _id = new mongoose.Types.ObjectId();

    if (target === "Product") {
      await Comment.create({
        _id,
        user: userId,
        target_id: targetId,
        value,
        target,
        created_at,
      });
      await Product.updateOne(
        { _id: targetId },
        {
          $push: {
            comments: _id,
            rating: { _id: userId, rating: value.rating },
          },
        }
      );
      return res.status(201).json({ message: "Success" });
    }
    if (target === "News") {
      await Comment.create({
        _id,
        user: userId,
        target_id: targetId,
        value,
        target,
        created_at,
      });
      await News.updateOne(
        { _id: targetId },
        {
          $push: {
            comments: _id,
            rating: { _id: userId, rating: value.rating },
          },
        }
      );
      return res.status(201).json({ message: "Success" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed adding new comment", error: err.message });
  }
};

const deleteOneComment = async (req, res) => {
  const { commentId, userId } = req.body;
  if (!commentId) {
    return res.status(422).json({ message: 'Provide comment id' });
  }
  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }
  try {
    await User.updateOne({ _id: userId }, { $pull: { news: commentId } });
    await Comment.deleteOne({ _id: commentId });
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed deleting a comment', error: err.message });
  }
};

module.exports = { getAllComments, addOneComment, deleteOneComment };
