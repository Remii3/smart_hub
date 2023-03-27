const User = require('../Models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signIn = async (req, res) => {
  const { email, password } = req.body;

  // prettier-ignore
  const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

  if (email.trim() === '') {
    return res.status(422).json({
      name: 'email',
      message: 'Email is required',
    });
  }

  if (!email.match(emailRegex)) {
    return res.status(422).json({
      name: 'email',
      message: 'Incorrect email address',
    });
  }

  if (password.trim() === '') {
    return res.status(422).json({
      name: 'password',
      message: 'Password is required',
    });
  }

  if (password.trim().length < 3) {
    return res.status(422).json({
      name: 'password',
      message: 'Password min length is 3 characters',
    });
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
  const salt = bcrypt.genSaltSync(12);

  const { email, username, password } = req.body;
  // prettier-ignore
  const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

  if (email.trim() === '') {
    return res.status(422).json({
      name: 'email',
      message: 'Email is required',
    });
  }

  if (!email.match(emailRegex)) {
    return res.status(422).json({
      name: 'email',
      message: 'Incorrect email address',
    });
  }

  if (username.trim() === '') {
    return res.status(422).json({
      name: 'username',
      message: 'Username is required',
    });
  }

  if (password.trim() === '') {
    return res.status(422).json({
      name: 'password',
      message: 'Password is required',
    });
  }

  if (password.trim().length < 3) {
    return res.status(422).json({
      name: 'password',
      message: 'Password min length is 3 characters',
    });
  }

  if (password.trim().length > 16) {
    return res.status(422).json({
      name: 'password',
      message: 'Password max length is 16 characters',
    });
  }

  try {
    const newUser = await User.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
    });
    await newUser.save();

    res.status(200).json({ message: 'Succesfully created an account' });
  } catch (e) {
    if (e.code === 11000) {
      const responseObject = e.keyValue;
      return res.status(422).json({
        name: Object.keys(responseObject)[0],
        message: Object.values(responseObject)[0] + ` already exists`,
      });
    }
    console.log(e.code);
    console.log(e);
    res.status(422).json(e);
  }
};

module.exports = { signIn, signUp };
