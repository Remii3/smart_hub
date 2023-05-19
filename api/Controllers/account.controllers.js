const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Product = require('../Models/product');
const { default: mongoose } = require('mongoose');
const Cart = require('../Models/cart');

const salt = bcrypt.genSaltSync(12);

const signIn = async (req, res) => {
  const { email, password } = req.body;

  // prettier-ignore
  const emailRegex = /^\S+@\S+\.\S+$/

  let errors = [];

  if (email.trim() === '') {
    errors.push({
      name: 'email',
      message: 'Email is required',
    });
  } else if (!email.match(emailRegex)) {
    errors.push({
      name: 'email',
      message: 'Incorrect email address',
    });
  }

  if (password.trim() === '') {
    errors.push({
      name: 'password',
      message: 'Password is required',
    });
  } else if (password.trim().length < 3) {
    errors.push({
      name: 'password',
      message: 'Min length is 3 characters',
    });
  }

  if (errors.length > 0) {
    return res.status(422).json(errors);
  }

  const userDoc = await User.findOne({ email });

  if (userDoc) {
    const passwordVerification = bcrypt.compareSync(password, userDoc.password);
    if (passwordVerification) {
      jwt.sign(
        {
          email: email,
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
    res.status(422).json({
      name: 'email',
      message: 'No account found',
    });
  }
};

const signUp = async (req, res) => {
  const { credentials, email, password, passwordConfirmation } = req.body;
  // prettier-ignore
  const emailAtRegex =  /^\S+@/
  // prettier-ignore
  const emailAfterAtRegex =  /^\S+@\S+\./
  // prettier-ignore
  const emailFullRegex = /^\S+@\S+\.\S+$/

  const errors = [];

  if (credentials.firstName.trim() === '') {
    errors.push({
      name: 'firstName',
      message: 'First name is required',
    });
  } else if (credentials.firstName.length < 3) {
    errors.push({
      name: 'firstName',
      message: 'Minimal length is 3',
    });
  }

  if (credentials.lastName.trim() === '') {
    errors.push({
      name: 'lastName',
      message: 'Last name is required',
    });
  } else if (credentials.lastName.length < 3) {
    errors.push({
      name: 'lastName',
      message: 'Minimal length is 3',
    });
  }

  if (email.trim() === '') {
    errors.push({
      name: 'email',
      message: 'Email is required',
    });
  } else if (!email.match(emailAtRegex)) {
    errors.push({
      name: 'email',
      message: 'Eamil requires @',
    });
  } else if (!email.match(emailAfterAtRegex)) {
    errors.push({
      name: 'email',
      message: 'Eamil requires values after @ and .',
    });
  } else if (!email.match(emailFullRegex)) {
    errors.push({
      name: 'email',
      message: 'Eamil requires values after .',
    });
  }

  if (password.trim() === '') {
    errors.push({
      name: 'password',
      message: 'Password is required',
    });
  } else if (password.trim().length < 3) {
    errors.push({
      name: 'password',
      message: 'Password min length is 3 characters',
    });
  } else if (password.trim().length > 16) {
    errors.push({
      name: 'password',
      message: 'Password max length is 16 characters',
    });
  } else if (password !== passwordConfirmation) {
    errors.push({
      name: 'password',
      message: 'Passwords are not the same',
    });
    errors.push({
      name: 'passwordConfirmation',
      message: 'Passwords are not the same',
    });
  }

  if (errors.length > 0) {
    return res.status(422).json(errors);
  }
  try {
    const newUser = await User.create({
      credentials,
      email,
      password: bcrypt.hashSync(password, salt),
    });
    await newUser.save();

    const cartId = new mongoose.Types.ObjectId();

    await Cart.create({ _id: cartId, products: [] });

    const userDoc = await User.findOne({ email });

    jwt.sign(
      {
        email: email,
        userId: userDoc._id,
      },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw 'firts';
        res
          .status(200)
          .cookie('token', token)
          .json({ message: 'Succesfully created an account' });
      },
    );
  } catch (e) {
    if (e.code === 11000) {
      const responseObject = e.keyValue;
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    }
    res.status(422).json(e);
  }
};

const profile = async (req, res) => {
  let userProductsData;

  const { email, credentials, cart, my_products } = await User.findOne({
    _id: req.user.userId,
  });

  const myProducts = await Product.find({ _id: my_products });
  userProductsData = myProducts;

  res.json({ email, credentials, cart, my_products: userProductsData });
};

const newData = async (req, res) => {
  let { userEmail, name, newValue } = req.body;
  let isCredentials = false;

  if (name === 'email') {
    // prettier-ignore
    const emailRegex = /^\S+@\S+\.\S+$/

    if (newValue.trim() === '') {
      return res.status(422).json({
        name: 'email',
        message: 'Minumum 1 character is required',
      });
    } else if (!name.match(emailRegex)) {
      return res.status(422).json({
        name: 'email',
        message: 'Incorrect email address',
      });
    }
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
  } catch (e) {
    if (e.code === 11000) {
      const responseObject = e.keyValue;
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    }
    res.status(422).json(e);
  }
};

const addToCart = async (req, res) => {
  res.status(200).json('hello test add');
};

const removeFromCart = async (req, res) => {
  res.status(200).json('hello test remove');
};

const getCart = async (req, res) => {
  res.status(200).json('hello test get');
};

module.exports = {
  signIn,
  signUp,
  profile,
  newData,
  addToCart,
  removeFromCart,
  getCart,
};
