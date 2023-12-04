const { checkEmail } = require('../helpers/checkUserData');

function verifyNewUserData(fieldKey, value) {
  const errors = [];
  switch (fieldKey) {
    case 'username':
      if (value.trim() === '') {
        errors.push({ name: fieldKey, message: 'Username is required' });
      } else if (fieldKey.length < 3) {
        errors.push({ name: fieldKey, message: 'Username is too short' });
      }
      break;
    case 'email':
      const emailErrors = checkEmail(value);
      errors.push(...emailErrors);
      break;
    case 'firstName':
      if (value.trim() === '') {
        errors.push({ name: fieldKey, message: 'No value provided.' });
      }
      break;
    case 'lastName':
      if (value.trim() === '') {
        errors.push({ name: fieldKey, message: 'No value provided.' });
      }
      break;
    case 'password':
      if (value.trim() === '') {
        errors.push({ name: fieldKey, message: 'No value provided' });
      }

      if (value.trim().length < 3) {
        errors.push({
          name: 'password',
          message: 'Minimum length is 3 characters',
        });
      }

      if (value.trim().length > 16) {
        errors.push({
          name: 'password',
          message: 'Max length is 16 characters',
        });
      }
      break;
    case 'profileImg':
      break;
    case 'backgroundImg':
      break;
    case 'addressLine1':
      break;
    case 'addressLine2':
      break;
    case 'city':
      break;
    case 'state':
      break;
    case 'postalCode':
      break;
    case 'country':
      break;
    case 'phone':
      break;

    default:
      break;
  }

  return errors;
}
function verifyNewAuthorData(fieldKey, value) {
  const errors = [];

  switch (fieldKey) {
    case 'categories':
      break;
    case 'pseudonim':
      break;
    case 'shortDescription':
      break;
    case 'quote':
      break;
    default:
      break;
  }
  return errors;
}

module.exports = { verifyNewUserData, verifyNewAuthorData };
