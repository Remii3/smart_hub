const { default: mongoose } = require('mongoose');
const News = require('../Models/news');
const User = require('../Models/user');
const Comment = require('../Models/comment');

const getAllNews = async (req, res) => {
  try {
    const data = await News.find({}, { comments: 0 }).sort({ created_at: -1 });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed fetching news',
      error: err.message,
    });
  }
};

const getOneNews = async (req, res) => {
  const { newsId } = req.query;

  if (!newsId) {
    return res.status(422).json({ message: 'Provide news id' });
  }

  try {
    const data = await News.findOne({ _id: newsId }).populate([
      {
        path: 'user',
      },
    ]);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed fetching news',
      error: err.message,
    });
  }
};
const deleteOneNews = async (req, res) => {
  const { userId, newsId } = req.body;

  if (!userId) {
    return res.json({ message: 'Provide user id' });
  }
  if (!newsId) {
    return res.json({ message: 'Provide news id' });
  }

  try {
    await User.updateOne({ _id: userId }, { $pull: { news: newsId } });
    await News.deleteOne({ _id: newsId });
    return res.json({ message: 'News was deleted' });
  } catch (err) {
    return res.json({ message: 'Failed removing news', error: err.message });
  }
};

const updateOne = async (req, res) => {
  const { _id, newData, img } = req.body;
  if (!_id) {
    return res.status(422).json({ message: 'Provide news id' });
  }
  const preparedData = { ...newData };

  if (img) {
    preparedData.img = img;
  }
  try {
    await News.updateOne(
      { _id },
      {
        ...preparedData,
      },
    );
    return res.status(200).json({ message: 'Successfully updated news' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed updating news',
      error: err.message,
    });
  }
};

const addOneNews = async (req, res) => {
  const { userId, title, subtitle, img, content } = req.body;

  if (!userId) {
    return res.status(422).json({ message: 'Provide user id' });
  }

  try {
    const created_at = new Date().getTime();
    const _id = new mongoose.Types.ObjectId();

    await News.create({
      user: userId,
      _id,
      title,
      subtitle: subtitle || null,
      img: img || null,
      content: content || null,
      created_at,
    });
    await User.updateOne({ _id: userId }, { $push: { news: _id } });
    return res.status(201).json({ message: 'Success', id: _id });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed adding news',
      error: err.message,
    });
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

module.exports = {
  getAllNews,
  getOneNews,
  addOneNews,
  deleteOneNews,
  addOneVote,
  removeOneVote,
  getAllVotes,
  updateOne,
};
