const { default: mongoose } = require('mongoose');
const Comment = require('../Models/comment');
const { Product } = require('../Models/product');
const News = require('../Models/news');
const calculateAvgRating = require('../helpers/calculate/calculateAvgRating');

const getAllComments = async (req, res) => {
  const { targetId, limit, skip } = req.query;

  if (!targetId) {
    return res.status(422).json({ message: 'Provide comment target id' });
  }
  try {
    const data = await Comment.find({ 'targetData._id': targetId })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .populate('creatorData');

    const documentsQuantity = await Comment.find({
      'targetData._id': targetId,
    }).countDocuments();

    let canShowMoreDocuments = true;

    if (Number(limit) + Number(skip * 2) > documentsQuantity) {
      canShowMoreDocuments = false;
    }

    return res
      .status(200)
      .json({ data: { data, rawData: { canShowMoreDocuments } } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching comments', error: err.message });
  }
};

const addOneComment = async (req, res) => {
  const { userId, targetData, value, nickname } = req.body;
  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  try {
    const createdAt = new Date().getTime();
    const _id = new mongoose.Types.ObjectId();
    await Comment.create({
      _id,
      creatorData: userId,
      targetData,
      value: { ...value, nickname },
      createdAt,
      updatedAt: createdAt,
    });
    const comments = await Comment.find({
      'targetData._id': targetData._id,
    }).lean();

    switch (targetData.type) {
      case 'Product': {
        const rating = calculateAvgRating(comments);
        await Product.updateOne({ _id: targetData._id }, { rating });
        break;
      }
      case 'News': {
        const rating = calculateAvgRating(comments);
        await News.updateOne({ _id: targetData._id }, { rating });
        break;
      }
    }

    return res.status(201).json({ message: 'Success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed adding new comment', error: err.message });
  }
};

const deleteOneComment = async (req, res) => {
  const { commentId } = req.body;
  if (!commentId) {
    return res.status(422).json({ message: 'Provide comment id' });
  }

  try {
    const commentData = await Comment.findOne({ _id: commentId });

    await Comment.deleteOne({ _id: commentId });

    const comments = await Comment.find({
      'targetData._id': commentId,
    }).lean();

    switch (commentData.targetData.type) {
      case 'Product': {
        const rating = calculateAvgRating(comments);
        await Product.updateOne(
          { _id: commentData.targetData._id },
          { rating },
        );
        break;
      }
      case 'News': {
        const rating = calculateAvgRating(comments);
        await News.updateOne({ _id: commentData.targetData._id }, { rating });
        break;
      }
    }

    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed deleting a comment', error: err.message });
  }
};

module.exports = { getAllComments, addOneComment, deleteOneComment };
