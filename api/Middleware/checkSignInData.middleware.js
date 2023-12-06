const { checkEmail, checkPassword } = require('../helpers/checkUserData');

const checkSignInData = (req, res, next) => {
  const { email, password } = req.body;

  let errors = [];

  const emailErrors = checkEmail(email);
  const passwordErrors = checkPassword(password);

  errors.push(...emailErrors, ...passwordErrors);

  if (errors.length > 0) {
    return res.status(422).json(errors);
  } else {
    next();
  }
};

module.exports = checkSignInData;
