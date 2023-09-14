const News = require("../Models/news");

const allNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({
      message: "Failed fetching news",
    });
  }
};

const oneNews = async (req, res) => {
  const { newsId } = req.query;
  try {
    const news = await News.findOne({ _id: newsId });
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json({
      message: "Failed fetching news",
    });
  }
};

const addNews = async (req, res) => {
  const { title, subtitle, headImage, content } = req.body;
  try {
    const created_at = new Date().getTime();
    await News.create({
      title,
      subtitle,
      headImage,
      content,
      created_at,
    });
    res.status(201).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({
      message: "Failed adding news",
    });
  }
};

module.exports = { allNews, oneNews, addNews };
