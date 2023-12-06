const Comment = require('../Models/comment');
const News = require('../Models/news');
const calculateAvgRating = require('../helpers/calculate/calculateAvgRating');

const getRating = async (req, res) => {
  const { targetId } = req.query;
  try {
    const comments = await Comment.find({ 'targetData._id': targetId })
      .populate('creatorData')
      .lean();
    const rating = { ...calculateAvgRating(comments), reviews: comments };

    return res.json({ data: rating });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to get rating', error: err.message });
  }
};

const addOneVote = async (req, res) => {
  const { userId, newsId, vote } = req.body;

  const voteValue = vote === 'Like' || 'Dislike' ? vote : null;

  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  if (!newsId) {
    return res.status(422).json({ message: 'Provide news id' });
  }

  if (voteValue === null) {
    return res.status(422).json({ message: 'Provide proper vote' });
  }

  try {
    await News.updateOne(
      { _id: newsId },
      {
        $push: { 'voting.votes': { userId: userId, vote: voteValue } },
        $inc: {
          [`voting.quantity.${vote === 'Like' ? 'likes' : 'dislikes'}`]: 1,
        },
      },
    );
    return res.status(200).json({ message: 'Succesfully added vote' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed adding vote', error: err.message });
  }
};

const removeOneVote = async (req, res) => {
  const { userId, newsId, vote } = req.body;

  const voteValue = vote === 'Like' || 'Dislike' ? vote : null;

  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  if (!newsId) {
    return res.status(422).json({ message: 'Provide news id' });
  }

  if (voteValue === null) {
    return res.status(422).json({ message: 'Provide proper vote' });
  }

  try {
    await News.updateOne(
      { _id: newsId },
      {
        $pull: { 'voting.votes': { userId: userId } },
        $inc: {
          [`voting.quantity.${vote === 'Like' ? 'likes' : 'dislikes'}`]: -1,
        },
      },
    );
    return res.status(200).json({ message: 'Succesfully removed vote' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed adding vote', error: err.message });
  }
};

const getAllVotes = async (req, res) => {
  const { newsId } = req.query;
  if (!newsId) {
    return res.json({ message: 'Provide news id' });
  }

  try {
    const data = await News.findOne({ _id: newsId }).select('voting');
    return res.json({ data });
  } catch (err) {
    return res.json({ message: 'Failed getting votes', error: err.message });
  }
};

module.exports = { getRating, addOneVote, removeOneVote, getAllVotes };
