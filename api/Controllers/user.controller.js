const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../Models/product');
const mongoose = require('mongoose');
const Cart = require('../Models/cart');
const getRandomString = require('../helpers/getRandomString');
const { checkEmail } = require('../helpers/checkUserData');

const salt = bcrypt.genSaltSync(12);

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passwordVerification = bcrypt.compareSync(password, userDoc.password);
    if (passwordVerification) {
      jwt.sign(
        {
          email,
          userId: userDoc._id,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw 'firts';
          res.status(200).cookie('token', token).json(userDoc);
        },
      );
    } else {
      res.status(422).json({
        name: 'password',
        message: 'Incorrect password',
      });
    }
  } else {
    res.status(500).json({
      name: 'email',
      message: 'No account found',
    });
  }
};

const signUp = async (req, res) => {
  let { credentials, email, password } = req.body;

  try {
    const cartId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    const newUser = await User.create({
      _id: userId,
      credentials,
      email,
      orders: [],
      address: '',
      password: bcrypt.hashSync(password, salt),
      cart: cartId,
      my_products: [],
    });
    await newUser.save();

    const newCart = new Cart({
      _id: cartId,
      userId,
      items: [],
    });
    await newCart.save();

    jwt.sign(
      {
        email,
        userId,
      },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw 'firts';
        res
          .status(201)
          .cookie('token', token)
          .json({ message: 'Succesfully created an account' });
      },
    );
  } catch (err) {
    if (e.code === 11000) {
      const responseObject = e.keyValue;
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    }
    res.status(500).json({ message: 'Failed to register', err });
  }
};

const profile = async (req, res) => {
  try {
    let { _id, email, credentials, my_products, following, followers } =
      await User.findOne({
        _id: req.user.userId,
      });

    my_products = await Product.find({ _id: my_products });
    const cartData = await Cart.findOne({ userId: _id });
    res.json({
      _id,
      email,
      credentials,
      cartData,
      my_products,
      following,
      followers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};

const newData = async (req, res) => {
  let { userEmail, name, newValue } = req.body;
  let isCredentials = false;
  let errors = [];
  if (name === 'email') {
    const emailErrors = checkEmail(newValue);
    errors.push(...emailErrors);
  }
  if (name === 'firstName') {
    if (newValue.trim() === '') {
      return res.status(422).json({
        name: 'firstName',
        message: 'Minumum 1 character is required',
      });
    }
    isCredentials = true;
  }

  if (name === 'lastName') {
    if (newValue.trim() === '') {
      return res.status(422).json({
        name: 'lastName',
        message: 'Minumum 1 character is required',
      });
    }
    isCredentials = true;
  }

  if (name === 'password') {
    if (newValue.trim() === '') {
      return res.status(422).json({
        name: 'password',
        message: 'Minumum 1 character is required',
      });
    }

    if (newValue.trim().length < 3) {
      return res.status(422).json({
        name: 'password',
        message: 'Min length is 3 characters',
      });
    }

    if (newValue.trim().length > 16) {
      return res.status(422).json({
        name: 'password',
        message: 'Max length is 16 characters',
      });
    }
    newValue = bcrypt.hashSync(newValue, salt);
  }
  if (errors.length > 0) {
    return res.status(422).json(errors[0]);
  }
  try {
    if (isCredentials) {
      const credentialsPath = 'credentials.' + name;
      await User.updateOne(
        { email: userEmail },
        { $set: { [credentialsPath]: newValue } },
      );
    } else {
      await User.updateOne(
        { email: userEmail },
        { $set: { [name]: newValue } },
      );
    }
    res.status(200).json({ message: 'Successfully updated data' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    } else {
      res.status(500).json({ message: 'Failed to update data', err });
    }
  }
};

const guestData = async (req, res) => {
  jwt.sign(
    {
      email: getRandomString(10),
      userId: getRandomString(15),
    },
    getRandomString(40),
    {},
    (err, token) => {
      if (err) res.status(500).json({ message: 'Failed to fetch guest Data' });
      token = token.slice(token.length - 12, token.length);
      res.status(200).cookie('guestToken', token).json('Success');
    },
  );
};

const otherUserData = async (req, res) => {
  const { userId } = req.query;

  User.findOne({ _id: userId })
    .populate('my_products')
    .then(data =>
      res.status(200).json({
        email: data.email,
        address: data.address,
        credentials: data.credentials,
        my_products: data.my_products,
      }),
    )
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch user data' });
    });
};

const addFollow = async (req, res) => {
  const { followGiverId, followReceiverId } = req.body;

  try {
    await User.updateOne(
      { _id: followGiverId },
      { $addToSet: { following: followReceiverId } },
    );
    await User.updateOne(
      { _id: followReceiverId },
      { $addToSet: { followers: followGiverId } },
    );
    res.status(200).json('success');
  } catch (err) {
    console.log(err);
  }
};
const removeFollow = async (req, res) => {
  const { followGiverId, followReceiverId } = req.body;

  try {
    await User.updateOne(
      { _id: followGiverId },
      { $pull: { following: followReceiverId } },
    );
    await User.updateOne(
      { _id: followReceiverId },
      { $pull: { followers: followGiverId } },
    );
    res.status(200).json('success');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signIn,
  signUp,
  profile,
  newData,
  guestData,
  otherUserData,
  addFollow,
  removeFollow,
};
