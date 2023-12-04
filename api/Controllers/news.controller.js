const { default: mongoose } = require('mongoose');
const News = require('../Models/news');
const Comment = require('../Models/comment');

const getAllNews = async (req, res) => {
  const { limit = 6, sortOption } = req.query;

  const pipeline = [];

  switch (sortOption) {
    case 'latest': {
      pipeline.push({ $match: { img: { $exists: true } } });
      pipeline.push({
        $sort: { createdAt: -1 },
      });
      pipeline.push({
        $limit: Number(limit),
      });
      break;
    }
    case 'top_rated': {
      pipeline.push({
        $match: {
          'voting.quantity.likes': { $exists: true },
          'voting.quantity.dislikes': { $exists: true },
        },
      });
      pipeline.push({
        $addFields: {
          computedField: {
            $subtract: ['$voting.quantity.likes', '$voting.quantity.dislikes'],
          },
        },
      });
      pipeline.push({
        $sort: { computedField: -1 },
      });
      pipeline.push({
        $limit: Number(limit),
      });
      break;
    }
  }

  try {
    const data = await News.aggregate(pipeline);
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
    const newsData = await News.findOne({ _id: newsId })
      .populate([
        {
          path: 'creatorData',
          select: ['userInfo.profileImg', 'authorInfo.pseudonim'],
        },
      ])
      .lean();
    const comments = await Comment.find({ 'targetData._id': newsData._id })
      .populate('creatorData')
      .lean();

    const creatorData = newsData.creatorData;

    const preparedData = {
      ...newsData,
      comments,
      creatorData: {
        _id: creatorData._id,
        pseudonim: creatorData.author_info.pseudonim,
        profileImg: creatorData.userInfo.profileImg,
      },
    };
    return res.status(200).json({ data: preparedData });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed fetching news',
      error: err.message,
    });
  }
};
const deleteOneNews = async (req, res) => {
  const { newsId } = req.body;

  if (!newsId) {
    return res.json({ message: 'Provide news id' });
  }

  try {
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
  const { creatorData, title, subtitle, img, shortDescription, content } =
    req.body;

  if (!creatorData) {
    return res.status(422).json({ message: 'Provide creatorData' });
  }

  try {
    const createdAt = new Date().getTime();
    const _id = new mongoose.Types.ObjectId();

    await News.create({
      creatorData,
      _id,
      title,
      subtitle,
      img,
      shortDescription,
      content: content,
      createdAt,
      updatedAt: createdAt,
    });
    return res.status(201).json({ message: 'Success', id: _id });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed adding news',
      error: err.message,
    });
  }
};

const findSearchedNews = async (req, res) => {
  const searchCopyPipeline = req.searchCopyPipeline;
  const searchPipeline = req.searchPipeline;

  try {
    const [countResult, newsData] = await Promise.all([
      News.aggregate(searchPipeline),
      News.aggregate(searchCopyPipeline),
    ]);
    const totalPages =
      countResult.length > 0 ? countResult[0].totalDocuments : 0;

    return res.json({ data: { data: newsData, rawData: { totalPages } } });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed searching for news',
      error: err.message,
    });
  }
};

module.exports = {
  getAllNews,
  getOneNews,
  addOneNews,
  deleteOneNews,
  updateOne,
  findSearchedNews,
};
