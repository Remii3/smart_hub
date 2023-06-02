const {
    checkEmail,
    checkCredentials,
    checkPassword,
} = require('../helpers/checkUserData');

const checkSignUpData = (req, res, next) => {
    let { credentials, email, password, passwordConfirmation } = req.body;

    let errors = [];
    const emailErrors = checkEmail(email);
    const credentialsErrors = checkCredentials(credentials);
    const passwordErrors = checkPassword(
        password,
        passwordConfirmation || null,
    );

    errors.push(...emailErrors, ...credentialsErrors, ...passwordErrors);

    if (errors.length > 0) {
        return res.status(422).json(errors);
    } else {
        next();
    }
};

module.exports = checkSignUpData;
