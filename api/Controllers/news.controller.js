const allNews = async (req, res) => {
  try {
    res.status(200).json([]);
  } catch (err) {
    res.status(500).json({
      message: 'Failed fetching news',
    });
  }
};

const oneNews = async (req, res) => {
  try {
    res.status(200).json({});
  } catch (err) {
    res.status(500).json({
      message: 'Failed fetching news',
    });
  }
};

const addNews = async (req, res) => {
  try {
    res.status(201).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({
      message: 'Failed adding news',
    });
  }
};

module.exports = { allNews, oneNews, addNews };
