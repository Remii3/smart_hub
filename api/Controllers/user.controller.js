const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Cart = require('../Models/cart');
const getRandomString = require('../helpers/getRandomString');
const { verifyNewUserData } = require('../helpers/verify');
const prepareProductObject = require('../helpers/prepareProductObject');
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'];
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
          user_id: userDoc._id,
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
      name: 'username',
      message: 'No account found',
    });
  }
};

const signUp = async (req, res) => {
  let { credentials, email, username, password } = req.body;

  try {
    const userId = new mongoose.Types.ObjectId();
    const cartId = new mongoose.Types.ObjectId();

    await User.create({
      _id: userId,
      email,
      username,
      password: bcrypt.hashSync(password, salt),
      user_info: {
        profile_img: '',
        profile_img_type: '',
        background_img: '',
        background_img_type: '',
        credentials: {
          first_name: credentials.firstName,
          last_name: credentials.lastName,
          full_name: `${credentials.firstName} ${credentials.lastName}`,
        },
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postal_code: '',
          country: '',
        },
        phone: '',
      },
      cart: cartId,
      following: [],
      orders: [],
      author_info: {
        categories: [],
        pseudonim: `${credentials.firstName} ${credentials.lastName}`,
        short_description: '',
        quote: '',
        avg_products_grade: 0,
        sold_books_quantity: 0,
        my_products: [],
        followers: [],
      },
    });

    await Cart.create({
      _id: cartId,
      user_id: userId,
      products: [],
    });

    jwt.sign(
      {
        email,
        user_id: userId,
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
    if (err.code === 11000) {
      const responseObject = err.keyValue;
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    }
    console.log(err);
    res.status(500).json({ message: 'Failed to register' });
  }
};

const myProfile = async (req, res) => {
  try {
    const {
      _id,
      email,
      username,
      user_info,
      following,
      orders,
      role,
      author_info,
      security_settings,
    } = await User.findOne(
      {
        _id: req.user.user_id,
      },
      { password: 0 },
    ).populate([
      {
        path: 'author_info',
        populate: { path: 'my_products' },
      },
      {
        path: 'orders',
      },
      {
        path: 'orders',
        populate: { path: 'products.product' },
      },
    ]);

    const cartData = await Cart.findOne({
      user_id: _id,
    });

    const {
      avg_products_grade,
      categories,
      followers,
      pseudonim,
      quote,
      short_description,
      sold_books_quantity,
    } = author_info;

    const preparedMyProducts = author_info.my_products.map(item => {
      return prepareProductObject(item);
    });

    const preparedAuthorInfo = {
      avg_products_grade,
      categories,
      followers,
      my_products: preparedMyProducts,
      pseudonim,
      quote,
      short_description,
      sold_books_quantity,
      _id,
    };

    let preparedUserData = {
      _id,
      email,
      username,
      user_info,
      following,
      orders,
      cart: cartData,
      role,
      security_settings,
    };

    if (role !== 'User') {
      preparedUserData.author_info = preparedAuthorInfo;
    }
    res.status(200).json(preparedUserData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};

const newData = async (req, res) => {
  let { userEmail, fieldKey, newValue } = req.body;
  const errors = verifyNewUserData(fieldKey, newValue);
  if (errors.length > 0) {
    return res.status(422).json(errors[0]);
  }
  let fieldPath = fieldKey;

  if (fieldKey === 'first_name' || fieldKey === 'last_name') {
    fieldPath = `user_info.credentials.${fieldKey}`;
  }

  if (fieldKey === 'address') {
    fieldPath = `user_info.${fieldKey}`;
  }
  if (fieldKey === 'password') {
    newValue = bcrypt.hashSync(newValue, salt);
  }

  console.log(fieldKey, newValue, userEmail);

  try {
    if (fieldKey === 'address') {
      await User.updateOne(
        { email: userEmail },
        { $set: { [fieldPath]: { ...newValue } } },
      );
    } else if (fieldKey === 'profile_img') {
      if (newValue == null) return;
      if (cover != null && imageMimeTypes.includes(cover.type)) {
        const test = await User.updateOne(
          { email: userEmail },
          {
            $set: {
              'user_info.profile_img': new Buffer.from(cover.data, 'base64'),
              'user_info.profile_img_type': cover.type,
            },
          },
        );
        console.log(test);
      }
    } else {
      await User.updateOne(
        { email: userEmail },
        { $set: { [`${fieldPath}`]: newValue } },
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
      console.log(err);
      res.status(500).json({ message: 'Failed to update data' });
    }
  }
};

const guestData = async (req, res) => {
  jwt.sign(
    {
      email: getRandomString(10),
      user_id: getRandomString(15),
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
  try {
    const { role, email, username, user_info, author_info } =
      await User.findOne({
        _id: userId,
      }).populate('author_info.my_products');
    const {
      avg_products_grade,
      categories,
      followers,
      pseudonim,
      quote,
      short_description,
      sold_books_quantity,
      _id,
    } = author_info;

    const preparedMyProducts = author_info.my_products.map(item => {
      return prepareProductObject(item);
    });

    const preparedAuthorInfo = {
      avg_products_grade,
      categories,
      followers,
      my_products: preparedMyProducts,
      pseudonim,
      quote,
      short_description,
      sold_books_quantity,
      _id,
    };

    if (role === 'Author') {
      res.status(200).json({
        email,
        username,
        user_info,
        author_info: preparedAuthorInfo,
      });
    } else {
      res.status(200).json({
        email,
        username,
        user_info,
        role,
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
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
      { $addToSet: { 'author_info.followers': followGiverId } },
    );
    res.status(200).json('success');
  } catch (err) {
    res.status(500).json({ message: 'Failed adding follow' });
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
      { $pull: { 'author_info.followers': followGiverId } },
    );
    res.status(200).json('success');
  } catch (err) {
    res.status(500).json({ message: 'Failed removing follow' });
  }
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await User.find({ role: 'Author' });
    const authorsData = [];
    for (const author of authors) {
      authorsData.push({
        label: author.author_info.pseudonim,
        value: author.author_info.pseudonim,
        _id: author._id,
      });
    }

    res.status(200).json(authorsData);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch authors' });
  }
};

const changeSecurityPermissions = async (req, res) => {
  const { userEmail, fieldKey, fieldValue } = req.body;
  await User.updateOne(
    { email: userEmail },
    { [`security_settings.${fieldKey}`]: fieldValue },
  );
};

module.exports = {
  signIn,
  signUp,
  myProfile,
  newData,
  guestData,
  otherUserData,
  addFollow,
  removeFollow,
  getAllAuthors,
  changeSecurityPermissions,
};
