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

  if (dirtyData.firstName !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.credentials.firstName': dirtyData.firstName,
    };
  }

  if (dirtyData.lastName !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.credentials.lastName': dirtyData.lastName,
    };
  }

  if (dirtyData.password) {
    const copyPassword = bcrypt.hashSync(dirtyData.password, salt);
    preparedData['$set'] = { password: copyPassword };
  }

  if (dirtyData.phone !== undefined) {
    preparedData['$set'] = { 'userInfo.phone': dirtyData.phone };
  }

  if (dirtyData.quote !== undefined) {
    preparedData['$set'] = { 'authorInfo.quote': dirtyData.quote };
  }

  if (dirtyData.pseudonim !== undefined) {
    preparedData['$set'] = { 'authorInfo.pseudonim': dirtyData.pseudonim };
  }

  if (dirtyData.shortDescription !== undefined) {
    preparedData['$set'] = {
      'authorInfo.shortDescription': dirtyData.shortDescription,
    };
  }

  if (dirtyData.line1 !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.line1': dirtyData.line1,
    };
  }
  if (dirtyData.line2 !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.line2': dirtyData.line2,
    };
  }
  if (dirtyData.city !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.city': dirtyData.city,
    };
  }
  if (dirtyData.state !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.state': dirtyData.state,
    };
  }
  if (dirtyData.postalCode !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.postalCode': dirtyData.postalCode,
    };
  }
  if (dirtyData.country !== undefined) {
    preparedData['$set'] = {
      ...preparedData['$set'],
      'userInfo.address.country': dirtyData.country,
    };
  }
  if (dirtyData.profileImg !== undefined) {
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
