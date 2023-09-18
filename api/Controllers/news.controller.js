const { default: mongoose } = require('mongoose');
const News = require('../Models/news');
const User = require('../Models/user');

const allNews = async (req, res) => {
  try {
    const news = await News.find({}, { comments: 0 });
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
    const { user, created_at, title, subtitle, head_image, content, comments } =
      await News.findOne({ _id: newsId }).populate([
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
    const data = { created_at, title, subtitle, head_image, content, user };
    res.status(200).json({ data, comments });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Failed fetching news',
    });
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
  const { vote } = req.body;
  console.log('add: ', vote);

  res.json('add');
};

const removeVote = async (req, res) => {
  const { vote } = req.body;
  console.log('remove: ', vote);
  res.json('remove');
};

module.exports = {
  allNews,
  oneNews,
  addNews,
  newsComments,
  addVote,
  removeVote,
};
