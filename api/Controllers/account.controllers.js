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
    res.status(422).json(e);
  }
};

const profile = async (req, res) => {
  const { email, username } = await User.findOne({ _id: req.user.userId });

  res.json({ email, username });
};

const newData = async (req, res) => {
  const salt = bcrypt.genSaltSync(12);
  let { currentEmail, data, dataName } = req.body;

  if (dataName === 'email') {
    const emailRegex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');

    if (data[dataName].trim() === '') {
      return res.status(422).json({
        name: 'email',
        message: 'Email is required',
      });
    }

    if (!data[dataName].match(emailRegex)) {
      return res.status(422).json({
        name: 'email',
        message: 'Incorrect email address',
      });
    }
  } else if (dataName === 'username') {
    if (data[dataName].trim() === '') {
      return res.status(422).json({
        name: 'username',
        message: 'Username is required',
      });
    }
  } else {
    if (data[dataName].trim() === '') {
      return res.status(422).json({
        name: 'password',
        message: 'Password is required',
      });
    }

    if (data[dataName].trim().length < 3) {
      return res.status(422).json({
        name: 'password',
        message: 'Password min length is 3 characters',
      });
    }

    if (data[dataName].trim().length > 16) {
      return res.status(422).json({
        name: 'password',
        message: 'Password max length is 16 characters',
      });
    }
  }

  // const keys = Object.entries(newDataSwitch);
  // const selectedNewData = keys.filter(([key, value]) => value === true);
  // const newDataField = Object.keys(Object.fromEntries(selectedNewData));

  if (data[dataName] === 'password') {
    password = bcrypt.hashSync(password, salt);
  }
  try {
    await User.updateOne(
      { email: currentEmail },
      { $set: { [dataName]: data[dataName] } },
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
  res.status(200).json({ message: 'Successfully created account' });
};

module.exports = { signIn, signUp, profile, newData };
