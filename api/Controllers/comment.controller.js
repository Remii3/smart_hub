const { default: mongoose } = require('mongoose');
const CommentModel = require('../Models/comment');
const Product = require('../Models/product');
const News = require('../Models/news');

const allComments = (req, res) => {
  const { productId } = req.query;
  CommentModel.findAll({ productId })
    .then(res => res.status(200).json(res.data))
    .catch(err => {
      return res.status(500).json({ message: 'Failed fetching comments' });
    });
};

const oneComment = (req, res) => {};

const addComment = async (req, res) => {
  const { userId, productId, value, target } = req.body;
  const created_at = new Date().getTime();
  try {
    const _id = new mongoose.Types.ObjectId();
    if (target === 'Product') {
      await CommentModel.create({
        _id,
        user: userId,
        product_id: productId,
        value,
        target,
        created_at,
      });
      await Product.updateOne({ _id: productId }, { $push: { comments: _id } });
    } else if (target === 'News') {
      await CommentModel.create({
        _id,
        user: userId,
        product_id: productId,
        value: { text: value },
        target,
        created_at,
      });
      await News.updateOne({ _id: productId }, { $push: { comments: _id } });
    }
    res.status(201).json({ message: 'Succesfully added new comment' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed adding new comment' });
  }
};

const commentDelete = async (req, res) => {
  const { commentId } = req.body;
  try {
    await CommentModel.deleteOne({ _id: commentId });
    res.json('success');
  } catch (err) {
    res.json('Failed');
  }
};

module.exports = { allComments, oneComment, addComment, commentDelete };
