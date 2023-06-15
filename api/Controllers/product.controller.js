const { default: mongoose } = require('mongoose');
const Product = require('../Models/product');
const User = require('../Models/user');
const Category = require('../Models/category');

const getAllProducts = async (req, res) => {
  try {
    const books = await Product.find().populate('category authors');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Fetching data went wrong' });
  }
};

const getShopProducts = async (req, res) => {
  try {
    const books = await Product.find({ marketPlace: 'Shop' });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Fetching shop data went wrong' });
  }
};

const getAuctionProducts = async (req, res) => {
  try {
    const books = await Product.find({ marketPlace: 'Auction' });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Fetching auction data went wrong' });
  }
};

const getProduct = async (req, res) => {
  const { productId } = req.query;
  if (!productId) res.status(422).json({ message: 'Product id is requried' });
  try {
    const product = await Product.findOne({ _id: productId });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Fetching data went wrong' });
  }
};

const addProduct = async (req, res) => {
  let {
    userEmail,
    title,
    authors,
    category,
    description,
    imgs,
    quantity,
    price,
    marketPlace,
  } = req.body;

  const categoryData = Category.findOne({ name: category });
  try {
    const newProductsId = new mongoose.Types.ObjectId();
    try {
      await Product.create({
        _id: newProductsId,
        userEmail,
        title,
        description,
        price,
        imgs,
        category: categoryData._id,
        authors,
        quantity,
        marketPlace,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Failed creating new product' });
    }
    try {
      await User.updateOne(
        { email: userEmail },
        { $push: { my_products: { _id: newProductsId } } },
      );
    } catch (err) {
      return res.status(500).json({ message: 'Failed updating user data' });
    }

    res.status(201).json({ message: 'Succesfully added enw product' });
  } catch (err) {
    res.status(500).json({ error: 'Adding product failed' });
  }
};

const updateProduct = async (req, res) => {
  const { _id, title, description, price, quantity } = req.body;
  try {
    await Product.updateOne({ _id }, { title, description, price, quantity });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Failed' });
  }
};

const deleteProduct = async (req, res) => {
  const { _id, userId } = req.body;
  try {
    await User.updateOne(
      { _id: userId },
      { $pull: { 'my_products.$._id': _id } },
    );
    await Product.deleteOne({ _id });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Failed' });
  }
};

module.exports = {
  getAllProducts,
  getShopProducts,
  getAuctionProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
