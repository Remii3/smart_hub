const { default: mongoose } = require('mongoose');
const Comment = require('../Models/comment');
const Product = require('../Models/product');

const getComments = (req, res) => {
  const { productId } = req.query;
  Comment.findAll({ productId })
    .then(res => res.status(200).json(res.data))
    .catch(err => {
      return res.status(500).json({ message: 'Failed fetching comments' });
    });
};
const addComment = async (req, res) => {
  const { userId, productId, value } = req.body;
  try {
    const _id = new mongoose.Types.ObjectId();
    await Comment.create({ _id, user: userId, productId, value });
    await Product.updateOne({ _id: productId }, { $push: { comments: _id } });
    res.status(201).json({ message: 'Succesfully added new comment' });
  } catch (err) {
    res.status(500).json({ message: 'Failed adding new comment' });
  }
};

module.exports = { getComments, addComment };