const { verifyNewUserData } = require('../helpers/verify');
const bcrypt = require('bcrypt');

const userPathUpdate = (req, res, next) => {
  const salt = bcrypt.genSaltSync(12);
  const { dirtyData } = req.body;
  const preparedData = {};

  if (dirtyData.username) {
    preparedData['$set'] = { username: dirtyData.username };
  }

  if (dirtyData.email) {
    preparedData['$set'] = { email: dirtyData.email };
  }

  if (dirtyData.role) {
    preparedData['$set'] = { role: dirtyData.role };
  }

  if (dirtyData.firstName) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.credentials.firstName': dirtyData.firstName,
    };
  }

  if (dirtyData.lastName) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.credentials.lastName': dirtyData.lastName,
    };
  }

  if (dirtyData.password) {
    const copyPassword = bcrypt.hashSync(dirtyData.password, salt);
    preparedData['$set'] = { password: copyPassword };
  }

  if (dirtyData.phone) {
    preparedData['$set'] = { 'userInfo.phone': dirtyData.phone };
  }

  if (dirtyData.quote) {
    preparedData['$set'] = { 'authorInfo.quote': dirtyData.quote };
  }

  if (dirtyData.pseudonim) {
    preparedData['$set'] = { 'authorInfo.pseudonim': dirtyData.pseudonim };
  }

  if (dirtyData.shortDescription) {
    preparedData['$set'] = {
      'authorInfo.shortDescription': dirtyData.shortDescription,
    };
  }

  if (dirtyData.line1) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.line1': dirtyData.line1,
    };
  }
  if (dirtyData.line2) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.line2': dirtyData.line2,
    };
  }
  if (dirtyData.city) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.city': dirtyData.city,
    };
  }
  if (dirtyData.state) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.state': dirtyData.state,
    };
  }
  if (dirtyData.postalCode) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.postalCode': dirtyData.postalCode,
    };
  }
  if (dirtyData.country) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.country': dirtyData.country,
    };
  }
  if (dirtyData.profileImg) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.profileImg': dirtyData.profileImg,
    };
  }
  if (dirtyData.selectedOptionName !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'securitySettings.hidePrivateInformation': dirtyData.selectedOptionName,
    };
  }
  req.preparedData = preparedData;
  next();
};

module.exports = userPathUpdate;
