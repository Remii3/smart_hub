const { default: mongoose } = require('mongoose');
const Category = require('../Models/category');
const Product = require('../Models/product');
const User = require('../Models/user');

const getAllBooks = async (req, res) => {
  const books = await Product.find({});
  res.json(books);
};

const getShopBooks = async (req, res) => {
  const books = await Product.find({ marketPlace: 'Shop' });
  res.json(books);
};

const getAuctionBooks = async (req, res) => {
  const books = await Product.find({ marketPlace: 'Auction' });
  res.json(books);
};

const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

const addProduct = async (req, res) => {
  let {
    userEmail,
    title,
    author,
    category,
    description,
    imgs,
    quantity,
    price,
    marketPlace,
    height,
    width,
    depth,
  } = req.body;
  const newProductsId = new mongoose.Types.ObjectId();
  try {
    const newProduct = await Product.create({
      _id: newProductsId,
      title,
      author,
      category: category,
      description,
      imgs,
      quantity,
      price,
      marketPlace,
      shipingDetails: { height, width, depth },
    });
    await newProduct.save();
    await User.updateOne(
      { email: userEmail },
      { $push: { my_products: [newProductsId] } },
    );
    res.status(200).json({ message: 'Successfully added new product' });
  } catch (err) {
    console.log(err);
    res.status(422).json(err);
  }
};

module.exports = {
  getAllBooks,
  getAuctionBooks,
  getShopBooks,
  getCategories,
  addProduct,
};
