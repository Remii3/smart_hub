const Product = require('../Models/product');

const getBooks = async (req, res) => {
  const books = await Product.find({});
  res.json(books);
};

module.exports = { getBooks };
