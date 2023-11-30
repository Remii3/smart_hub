const User = require('../Models/user');

const getSearchedUsers = async (req, res) => {
  const { skipPages, currentPageSize } = req.paginationInfo;
  const sort = req.sortMethod;
  const query = req.searchQuery;
  const rawData = {};

  try {
    const users = await User.find(query)
      .sort(sort)
      .skip(skipPages)
      .limit(currentPageSize);
    const userQuantity = await User.find(query).countDocuments();
    rawData.quantity = userQuantity;

    return res.status(200).json({ data: { data: users, rawData } });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching users data', error: err.message });
  }
};

const getOneUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(422)
      .json({ message: 'Provide email', error: err.message });
  }

  try {
    const user = await User.findOne({ email });
    return res.status(200).json({ data: user });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed fetching user data', error: err.message });
  }
};

module.exports = { getSearchedUsers, getOneUser };
