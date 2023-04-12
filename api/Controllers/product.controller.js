const Category = require('../Models/category');
const Product = require('../Models/product');

const getBooks = async (req, res) => {
  const books = await Product.find({});
  res.json(books);
};
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};
module.exports = { getBooks, getCategories };
