const { verifyNewUserData } = require('../helpers/verify');
const bcrypt = require('bcrypt');

const userPathUpdate = (req, res, next) => {
  const salt = bcrypt.genSaltSync(12);
  const { dirtyData } = req.body;
  const preparedData = {};

  if (dirtyData.username) {
    preparedData['$set'] = { username: dirtyData.username };
  }

  if (dirtyData.firstName) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.credentials.first_name': dirtyData.firstName,
    };
  }

  if (dirtyData.lastName) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.credentials.last_name': dirtyData.lastName,
    };
  }

  if (dirtyData.password) {
    const copyPassword = bcrypt.hashSync(dirtyData.password, salt);
    preparedData['$set'] = { password: copyPassword };
  }

  if (dirtyData.phone) {
    preparedData['$set'] = { 'user_info.phone': dirtyData.phone };
  }

  if (dirtyData.quote) {
    preparedData['$set'] = { 'author_info.quote': dirtyData.quote };
  }

  if (dirtyData.pseudonim) {
    preparedData['$set'] = { 'author_info.pseudonim': dirtyData.pseudonim };
  }

  if (dirtyData.shortDescription) {
    preparedData['$set'] = {
      'author_info.short_description': dirtyData.shortDescription,
    };
  }

  if (dirtyData.line1) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.address.line1': dirtyData.line1,
    };
  }
  if (dirtyData.line2) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.address.line2': dirtyData.line2,
    };
  }
  if (dirtyData.city) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.address.city': dirtyData.city,
    };
  }
  if (dirtyData.state) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.address.state': dirtyData.state,
    };
  }
  if (dirtyData.postalCode) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.address.postal_code': dirtyData.postalCode,
    };
  }
  if (dirtyData.country) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.address.country': dirtyData.country,
    };
  }
  if (dirtyData.profileImg) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'user_info.profile_img': dirtyData.profileImg,
    };
  }

  req.preparedData = preparedData;
  next();
};

module.exports = userPathUpdate;
