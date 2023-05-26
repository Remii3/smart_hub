const { default: mongoose } = require('mongoose');
const Category = require('../Models/category');
const Product = require('../Models/product');
const User = require('../Models/user');

const getAllProducts = async (req, res) => {
  try {
    const books = await Product.find({});
    res.status(200).json(books);
  } catch (err) {
    res.status(422).json({ message: 'Fetching data went wrong' });
  }
};

const getShopProducts = async (req, res) => {
  try {
    const books = await Product.find({ marketPlace: 'Shop' });
    res.status(200).json(books);
  } catch (err) {
    res.status(422).json({ message: 'Fetching data went wrong' });
  }
};

const getAuctionProducts = async (req, res) => {
  try {
    const books = await Product.find({ marketPlace: 'Auction' });
    res.status(200).json(books);
  } catch (err) {
    res.status(422).json({ message: 'Fetching data went wrong' });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    res.status(422).json({ message: 'Fetching data went wrong' });
  }
};

const getProduct = async (req, res) => {
  const { productId } = req.query;
  if (!productId) res.status(422).json({ message: 'Product id is requried' });
  try {
    const product = await Product.findOne({ _id: productId });
    res.status(200).json(product);
  } catch (err) {
    res.status(422).json({ message: 'Fetching data went wrong' });
  }
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
    res.status(422).json({ message: 'Adding product failed' });
  }
};

module.exports = {
  getAllProducts,
  getShopProducts,
  getAuctionProducts,
  getCategories,
  getProduct,
  addProduct,
};
