const { default: mongoose } = require('mongoose');
const Comment = require('../Models/comment');
const Product = require('../Models/product');

const allComments = (req, res) => {
  const { productId } = req.query;
  Comment.findAll({ productId })
    .then(res => res.status(200).json(res.data))
    .catch(err => {
      return res.status(500).json({ message: 'Failed fetching comments' });
    });
};

const oneComment = (req, res) => {};

const addComment = async (req, res) => {
  const { userId, productId, value } = req.body;
  const created_at = new Date().getTime();
  try {
    const _id = new mongoose.Types.ObjectId();
    await Comment.create({
      _id,
      user: userId,
      product_id: productId,
      value,
      created_at,
    });
    await Product.updateOne({ _id: productId }, { $push: { comments: _id } });
    res.status(201).json({ message: 'Succesfully added new comment' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed adding new comment' });
  }
};

module.exports = { allComments, oneComment, addComment };
