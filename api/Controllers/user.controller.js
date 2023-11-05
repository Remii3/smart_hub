const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Cart = require('../Models/cart');
const getRandomString = require('../helpers/getRandomString');
const prepareProductObject = require('../helpers/prepareProductObject');
const salt = bcrypt.genSaltSync(12);

const login = async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (!userDoc)
    return res.status(422).json({
      name: 'email',
      error: 'No account found',
      message: 'No account found',
    });
  const passwordVerification = bcrypt.compareSync(password, userDoc.password);
  if (!passwordVerification)
    return res.status(422).json({
      name: 'password',
      error: 'Invalid password',
      message: 'Invalid password',
    });
  jwt.sign(
    {
      email,
      user_id: userDoc._id,
    },
    process.env.JWT_SECRET,
    {},
    (err, token) => {
      if (err) throw 'firts';
      return res.status(200).cookie('token', token).json({ data: userDoc });
    },
  );
};

const register = async (req, res) => {
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
        profile_img: {},
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
        return res
          .status(201)
          .cookie('token', token)
          .json({ message: 'Succesfully created an account' });
      },
    );
  } catch (err) {
    if (err.code === 11000) {
      const responseObject = err.keyValue;
      return res.status(422).json({
        message: Object.values(responseObject)[0] + ` already exists`,
        error: err.message,
        name: 'email',
      });
    }
    return res
      .status(500)
      .json({ message: 'Failed to register', error: err.message });
  }
};

const getMyProfile = async (req, res) => {
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
      news,
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
      news,
    };

    if (role !== 'User') {
      preparedUserData.author_info = preparedAuthorInfo;
    }
    res.status(200).json({ data: preparedUserData });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
};

const getOtherProfile = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(422).json({ message: 'user id is required' });
  }

  try {
    const { role, email, username, user_info, author_info, security_settings } =
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
    console.log(security_settings.hide_private_information);
    let preparedUserInfo = null;
    if (!security_settings.hide_private_information) {
      preparedUserInfo = user_info;
    }
    if (role !== 'User') {
      return res.status(200).json({
        data: {
          email,
          username,
          user_info: preparedUserInfo,
          author_info: preparedAuthorInfo,
          role,
        },
      });
    } else {
      return res.status(200).json({
        data: {
          email,
          username,
          user_info: preparedUserInfo,
          role,
        },
      });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch user data', error: err.message });
  }
};

const getGuestProfile = async (req, res) => {
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

    return res.status(200).json({ data: authorsData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch authors', error: err.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'Admin' });
    const adminData = [];
    for (const admin of admins) {
      adminData.push({
        label: admin.author_info.pseudonim,
        value: admin.admin_info.pseudonim,
        _id: admin._id,
      });
    }

    return res.status(200).json({ data: adminData });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch authors', error: err.message });
  }
};

const addOneFollow = async (req, res) => {
  const { followGiverId, followReceiverId } = req.body;

  if (!followGiverId) {
    return res.status(422).json({ message: 'Giver id is required' });
  }
  if (!followReceiverId) {
    return res.status(422).json({ message: 'Receiver id is required' });
  }

  try {
    await User.updateOne(
      { _id: followGiverId },
      { $addToSet: { following: followReceiverId } },
    );
    await User.updateOne(
      { _id: followReceiverId },
      { $addToSet: { 'author_info.followers': followGiverId } },
    );
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed adding follow', error: err.message });
  }
};

const removeOneFollow = async (req, res) => {
  const { followGiverId, followReceiverId } = req.body;

  if (!followGiverId) {
    return res.status(422).json({ message: 'Giver id is required' });
  }
  if (!followReceiverId) {
    return res.status(422).json({ message: 'Receiver id is required' });
  }

  try {
    await User.updateOne(
      { _id: followGiverId },
      { $pull: { following: followReceiverId } },
    );
    await User.updateOne(
      { _id: followReceiverId },
      { $pull: { 'author_info.followers': followGiverId } },
    );
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed removing follow', error: err.message });
  }
};

const updateOneUser = async (req, res) => {
  const { userEmail, fieldValue } = req.body;
  const { fieldPath } = req;
  try {
    if (fieldPath === null) {
      const mainData = {
        username: fieldValue.username,
        email: fieldValue.email,
        role: fieldValue.role,
      };
      if (fieldValue.password.trim().length > 0) {
        mainData.password = bcrypt.hashSync(fieldValue.password, salt);
      }
      await User.updateOne(
        {
          email: userEmail,
        },
        {
          $set: {
            ...mainData,
            'user_info.phone': fieldValue.phone,
            'user_info.profile_img': fieldValue.profileImg,
            'user_info.credentials.first_name': fieldValue.firstName,
            'user_info.credentials.last_name': fieldValue.lastName,
            'author_info.quote': fieldValue.quote,
            'author_info.short_description': fieldValue.shortDescription,
            'author_info.pseudonim': fieldValue.pseudonim,
          },
        },
        { upsert: true },
      );
    }
    if (typeof fieldValue == 'object') {
      await User.updateOne(
        { email: userEmail },
        { $set: { [fieldPath]: { ...fieldValue } } },
      );
    } else {
      await User.updateOne(
        { email: userEmail },
        { $set: { [fieldPath]: fieldValue } },
      );
    }

    return res.status(200).json({ message: 'Successfully updated data' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    } else {
      return res
        .status(500)
        .json({ message: 'Failed to update data', error: err.message });
    }
  }
};

const deleteOneUser = async (req, res) => {
  const { userId } = req.body;
  try {
    await User.deleteOne({ _id: userId });
    await Cart.deleteOne({ user_id: userId });
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed deleting user', error: err.message });
  }
};

module.exports = {
  login,
  register,
  getMyProfile,
  getOtherProfile,
  getGuestProfile,
  getAllAuthors,
  getAllAdmins,
  addOneFollow,
  removeOneFollow,
  updateOneUser,
  deleteOneUser,
};
