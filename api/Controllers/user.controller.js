const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Cart = require('../Models/cart');
const { Product } = require('../Models/product');
const getRandomString = require('../helpers/getRandomString');
const cashFormatter = require('../helpers/cashFormatter');
const salt = bcrypt.genSaltSync(12);

const prepareData = originalData => {
  if (Array.isArray(originalData)) {
    const preparedData = [...originalData];

    for (let i = 0; i < originalData.length; i++) {
      preparedData[i].price = {
        ...preparedData[i].price,
        value: `${cashFormatter({
          number: preparedData[i].price.value,
        })}`,
      };
    }
    return preparedData;
  } else {
    const preparedData = { ...originalData };

    preparedData.price = {
      ...preparedData.price,
      value: `${cashFormatter({
        number: preparedData.price.value,
      })}`,
    };
    return preparedData;
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const userData = await User.findOne({ email });
  if (!userData)
    return res.status(422).json({
      name: 'email',
      error: 'No account found',
      message: 'No account found',
    });
  const passwordVerification = bcrypt.compareSync(password, userData.password);
  if (!passwordVerification)
    return res.status(422).json({
      name: 'password',
      error: 'Invalid password',
      message: 'Invalid password',
    });
  jwt.sign(
    {
      email,
      userId: userData._id,
    },
    process.env.JWT_SECRET,
    {},
    (err, token) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
          message: 'We failed loggin you in.',
        });
      }
      return res
        .status(200)
        .cookie('token', token, {
          // secure: true,
          sameSite: 'None',
          path: '/',
        })
        .json({ data: userData });
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
      userInfo: {
        profileImg: {
          id: new mongoose.Types.ObjectId(),
          url: 'https://firebasestorage.googleapis.com/v0/b/smarthub-75eab.appspot.com/o/static_imgs%2Fnophoto.webp?alt=media&token=a974d32e-108a-4c21-be71-de358368a167',
        },
        credentials: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
        },
        address: {
          line1: '',
          line2: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        },
        phone: '',
      },
      cart: cartId,
      following: [],
      orders: [],
      authorInfo: {
        pseudonim: `${username}`,
        shortDescription: '',
        quote: '',
        followers: [],
      },
    });

    await Cart.create({
      _id: cartId,
      userId,
      products: [],
    });

    jwt.sign(
      {
        email,
        userId,
      },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) {
          return res.status(500).json({
            error: err.message,
            message: 'We failed loggin you in.',
          });
        }
        return res
          .status(201)
          .cookie('token', token, {
            // secure: true,
            sameSite: 'None',
            path: '/',
          })
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
  // let preparedData = {};
  try {
    const userData = await User.findOne(
      {
        _id: req.user.userId,
      },
      { password: 0 },
    );

    // const cartData = await Cart.findOne({
    //   userId: userData._id,
    // });
    // preparedData = userData;
    if (userData.role != 'User') {
      // const userProducts = await Product.find({
      //   $or: [{ authors: userData._id }, { 'creatorData._id': userData._id }],
      //   sold: false,
      //   deleted: false,
      //   quantity: { $gt: 0 },
      // }).lean();
      // const userProductsCopy = userProducts.map(product => ({
      //   ...product,
      //   price: {
      //     ...product.price,
      //     value: `${cashFormatter({
      //       number: product.price.value,
      //     })}`,
      //   },
      // }));
      // const preparedAuthorInfo = {
      //   avg_products_grade,
      //   categories,
      //   followers,
      //   my_products: userProductsCopy,
      //   myCollections: [],
      //   pseudonim,
      //   quote,
      //   short_description,
      //   sold_books_quantity,
      //   _id,
      // };
    } else {
      // preparedData = {
      //   _id: userData._id,
      //   email: userData.email
      // };
      // let preparedUserData = {
      //   _id,
      //   email,
      //   username,
      //   user_info,
      //   following,
      //   orders,
      //   cart: cartData,
      //   role,
      //   security_settings,
      //   news,
      // };
    }

    res.status(200).json({ data: userData });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch user data', error: err.message });
  }
};

const getOtherProfile = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(422).json({ message: 'user id is required' });
  }
  try {
    const otherUserData = await User.findOne({
      _id: userId,
    });

    const otherUserProductsData = await Product.find({
      $or: [{ 'creatorData._id': userId }, { authors: userId }],
      deleted: false,
      sold: false,
      quantity: { $gt: 0 },
    })
      .populate(['authors', 'categories'])
      .lean();

    const preparedProducts = prepareData(otherUserProductsData);

    return res.status(200).json({
      data: { otherUserData, otherUserProductsData: preparedProducts },
    });
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
      userId: getRandomString(15),
    },
    getRandomString(40),
    {},
    (err, token) => {
      if (err) res.status(500).json({ message: 'Failed to fetch guest Data' });
      token = token.slice(token.length - 12, token.length);
      res
        .status(200)
        .cookie('guestToken', token, {
          // secure: true,
          sameSite: 'None',
          path: '/',
        })
        .json('Success');
    },
  );
};

const getAllAuthors = async (req, res) => {
  try {
    const authors = await User.find({ role: 'Author' });
    // const authorsData = [];
    // for (const author of authors) {
    //   authorsData.push({
    //     label: author.author_info.pseudonim,
    //     value: author.author_info.pseudonim,
    //     _id: author._id,
    //   });
    // }

    return res.status(200).json({ data: authors });
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
        label: admin.authorInfo.pseudonim,
        value: admin.authorInfo.pseudonim,
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
      { $addToSet: { 'authorInfo.followers': followGiverId } },
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
      { $pull: { 'authorInfo.followers': followGiverId } },
    );
    return res.status(200).json({ message: 'success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed removing follow', error: err.message });
  }
};

const updateOneUser = async (req, res) => {
  const { _id } = req.body;
  const preparedData = req.preparedData;
  try {
    await User.updateOne(
      {
        _id,
      },
      preparedData,
      { upsert: true },
    );

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
    await Cart.deleteOne({ userId: userId });
    return res.status(200).json({ message: 'Success' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed deleting user', error: err.message });
  }
};

const getFollowedUsers = async (req, res) => {
  const { userId, pageSize, filtersData } = req.query;
  const fetchedUserData = [];

  if (!userId) {
    return res.status(402).json({ message: 'UserId is required' });
  }

  try {
    const userData = await User.findOne({ _id: userId });
    if (!userData.following || userData.following.length <= 0) {
      return res.status(200).json({ data: fetchedUserData });
    }

    const searchQuery = {
      _id: { $in: userData.following },
    };

    if (!filtersData) {
      filtersData = { page: 1 };
    }

    let currentPage = filtersData.page;

    if (!currentPage) {
      currentPage = 1;
    }

    let currentPageSize = pageSize;
    if (!currentPageSize) {
      currentPageSize = 10;
    }

    const skipPages = (currentPage - 1) * currentPageSize;

    if (filtersData.searchedPhrase) {
      searchQuery['$or'] = [
        { username: { $regex: new RegExp(filtersData.searchedPhrase, 'i') } },
        { email: { $regex: new RegExp(filtersData.searchedPhrase, 'i') } },
      ];
    }

    const authorsData = await User.find(searchQuery)
      .sort({ email: -1 })
      .skip(skipPages)
      .limit(currentPageSize);

    const copyData = [...authorsData];
    const preparedData = copyData.map(author => ({
      _id: author._id,
      username: author.username,
      role: author.role,
      userInfo: { profileImg: author.userInfo.profileImg },
      authorInfo:
        author.role !== 'User'
          ? {
              pseudonim: author.authorInfo.pseudonim,
              quote: author.authorInfo.quote,
            }
          : {},
    }));

    return res.status(200).json({ data: { data: preparedData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed loading followed users', error: err.message });
  }
};

const getFollowes = async (req, res) => {
  const { _id } = req.query;
  try {
    const data = await User.findOne({ _id }, { 'authorInfo.followers': 1 });
    if (data) {
      return res.json({ data: data.authorInfo.followers });
    }
    return res.json({ data: data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching followers.', error: err.message });
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
  getFollowedUsers,
  deleteOneUser,
  getFollowes,
};
