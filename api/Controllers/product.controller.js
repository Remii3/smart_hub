const { default: mongoose } = require('mongoose');
const Product = require('../Models/product');
const User = require('../Models/user');
const Category = require('../Models/category');

const getAllProducts = async (req, res) => {
  try {
    const books = await Product.find().populate('categories authors');
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Fetching data went wrong', err });
  }
};

const getShopProducts = async (req, res) => {
  try {
    const books = await Product.find({ marketPlace: 'Shop' });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Fetching shop data went wrong', err });
  }
};

const getAuctionProducts = async (req, res) => {
  try {
    const books = await Product.find({ marketPlace: 'Auction' });
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: 'Fetching auction data went wrong', err });
  }
};

const getProduct = async (req, res) => {
  const { productId } = req.query;
  if (!productId) res.status(422).json({ message: 'Product id is requried' });
  try {
    const product = await Product.findOne({ _id: productId });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Fetching data went wrong', err });
  }
};

const addProduct = async (req, res) => {
  let {
    userProp,
    title,
    authors,
    categories,
    description,
    imgs,
    quantity,
    price,
    marketPlace,
  } = req.body;

  try {
    for (const item of categories) {
      const categoryExists = await Category.find({ _id: item._id });
      if (categoryExists.length < 1) {
        await Category.create({
          value: item.value,
          label: item.label,
          description: '',
        });
      }
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed verifying categories', err });
  }
  try {
    const newProductsId = new mongoose.Types.ObjectId();
    const addedDate = new Date().getTime();

    try {
      await Product.create({
        _id: newProductsId,
        userProp,
        title,
        description,
        price,
        imgs,
        categories,
        authors,
        quantity,
        marketPlace,
        addedDate,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Failed creating new product', err });
    }
    try {
      await User.updateOne(
        { email: userProp.email },
        { $push: { my_products: { _id: newProductsId } } },
      );
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Failed updating user data', err });
    }

    res.status(201).json({ message: 'Succesfully added enw product' });
  } catch (err) {
    res.status(500).json({ error: 'Adding product failed', err });
  }
};

const updateProduct = async (req, res) => {
  const { _id, title, description, price, quantity } = req.body;
  try {
    await Product.updateOne({ _id }, { title, description, price, quantity });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(500).json({ message: 'Failed', err });
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
    res.status(500).json({ message: 'Failed', err });
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
