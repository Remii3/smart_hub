const { verifyNewUserData } = require('../helpers/verify');

const userPathUpdate = (req, res, next) => {
  let { fieldKey, fieldValue } = req.body;
  const errors = verifyNewUserData(fieldKey, fieldValue);

  if (errors.length > 0) {
    return res.status(422).json(errors[0]);
  }

  let fieldPath = fieldKey;

  switch (fieldKey) {
    case null:
      fieldPath = null;
      break;
    case 'phone':
      fieldPath = `user_info.${fieldKey}`;
      break;
    case 'first_name':
      fieldPath = `user_info.credentials.${fieldKey}`;
      break;
    case 'last_name':
      fieldPath = `user_info.credentials.${fieldKey}`;
      break;
    case 'address':
      fieldPath = `user_info.${fieldKey}`;
      break;
    case 'password':
      fieldValue = bcrypt.hashSync(fieldValue, salt);
      break;
    case 'pseudonim':
      fieldPath = `author_info.${fieldKey}`;
      break;
    case 'short_description':
      fieldPath = `author_info.${fieldKey}`;
      break;
    case 'quote':
      fieldPath = `author_info.${fieldKey}`;
      break;
    case 'hide_private_information':
      fieldPath = `security_settings.${fieldKey}`;
      break;
    case 'profile_img':
      fieldPath = `user_info.${fieldKey}`;
      break;
  }
  req.fieldPath = fieldPath;
  next();
};

module.exports = userPathUpdate;
