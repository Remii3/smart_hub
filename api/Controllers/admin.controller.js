const User = require('../Models/user');

const users = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json('Failed fetching users');
  }
};

const user = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json('Failed fetching users');
  }
};

module.exports = { users, user };
