const { default: mongoose } = require('mongoose');
const News = require('../Models/news');
const User = require('../Models/user');

const allNews = async (req, res) => {
  try {
    const news = await News.find({}, { comments: 0 }).sort({ created_at: -1 });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({
      message: 'Failed fetching news',
    });
  }
};

const oneNews = async (req, res) => {
  const { newsId } = req.query;

  try {
    const {
      user,
      created_at,
      title,
      rating,
      subtitle,
      head_image,
      content,
      comments,
    } = await News.findOne({ _id: newsId }).populate([
      {
        path: 'comments',
        options: { sort: { created_at: -1 } },
        populate: {
          path: 'user',
        },
      },
      {
        path: 'user',
      },
    ]);
    const data = {
      created_at,
      title,
      subtitle,
      rating,
      head_image,
      content,
      user,
    };
    res.status(200).json({ data, comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed fetching news',
    });
  }
};
const deleteNews = async (req, res) => {
  const { userId, newsId } = req.body;
  try {
    await User.updateOne({ _id: userId }, { $pull: { news: newsId } });
    await News.deleteOne({ _id: newsId });
    res.json('Success news deleted');
  } catch (err) {
    console.log(err);
    res.json('Failed removing news');
  }
};
const newsComments = async (req, res) => {
  const { newsId } = req.query;
  try {
    const { comments } = await News.findOne({ _id: newsId })
      .select('comments')
      .populate([
        {
          path: 'comments',
          options: { sort: { created_at: -1 } },
          populate: {
            path: 'user',
          },
        },
      ]);
    res.status(200).json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed fetching news comments',
    });
  }
};

const addNews = async (req, res) => {
  const { userId, title, subtitle, headImage, content } = req.body;
  try {
    const created_at = new Date().getTime();
    const _id = new mongoose.Types.ObjectId();

    await News.create({
      user: userId,
      _id,
      title,
      subtitle,
      headImage,
      content,
      created_at,
    });
    await User.updateOne({ _id: userId }, { $push: { news: _id } });
    res.status(201).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({
      message: 'Failed adding news',
    });
  }
};

const addVote = async (req, res) => {
  const { userId, newsId, vote } = req.body;
  try {
    if (vote === 'like') {
      await News.updateOne(
        { _id: newsId },
        {
          $push: { 'rating.votes': { user: userId, vote: 1 } },
          $inc: { 'rating.quantity.likes': 1 },
        },
      );
      res.json('Succesfully added vote');
    } else if ('dislike') {
      await News.updateOne(
        { _id: newsId },
        {
          $push: { 'rating.votes': { user: userId, vote: 0 } },
          $inc: { 'rating.quantity.dislikes': 1 },
        },
      );
      res.json('Succesfully added vote');
    } else {
      res.status(400).json('No vote type matched');
    }
  } catch (err) {
    console.log(err);
    res.json('Failed adding vote');
  }
};

const removeVote = async (req, res) => {
  const { userId, newsId, vote } = req.body;
  try {
    if (vote === 'like') {
      await News.updateOne(
        { _id: newsId },
        {
          $pull: { 'rating.votes': { user: userId } },
          $inc: { 'rating.quantity.likes': -1 },
        },
      );
      res.json('Succesfully removed vote');
    } else if (vote === 'dislike') {
      await News.updateOne(
        { _id: newsId },
        {
          $pull: { 'rating.votes': { user: userId } },
          $inc: { 'rating.quantity.dislikes': -1 },
        },
      );
      res.json('Succesfully removed vote');
    } else {
      res.status(400).json('Failed finding vote type');
    }
  } catch (err) {
    console.log(err);
    res.json('Failed removing vote');
  }
};

const getVotes = async (req, res) => {
  const { newsId } = req.query;
  try {
    const data = await News.findOne({ _id: newsId }).select('rating');
    res.json(data);
  } catch (err) {
    console.log(err);
    res.json('Failed getting votes');
  }
};

module.exports = {
  allNews,
  oneNews,
  addNews,
  newsComments,
  addVote,
  removeVote,
  getVotes,
  deleteNews,
};
