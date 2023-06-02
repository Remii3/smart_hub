const checkEmail = email => {
    const errors = [];
    // prettier-ignore
    const emailAtRegex =  /^\S+@/
    // prettier-ignore
    const emailAfterAtRegex =  /^\S+@\S+\./
    // prettier-ignore
    const emailFullRegex = /^\S+@\S+\.\S+$/

    if (email.trim() === '') {
        errors.push({
            name: 'email',
            message: 'Email is required',
        });
    } else if (!email.match(emailAtRegex)) {
        errors.push({
            name: 'email',
            message: 'Eamil requires @',
        });
    } else if (!email.match(emailAfterAtRegex)) {
        errors.push({
            name: 'email',
            message: 'Eamil requires values after @ and .',
        });
    } else if (!email.match(emailFullRegex)) {
        errors.push({
            name: 'email',
            message: 'Eamil requires values after .',
        });
    }
    return errors;
};

const checkCredentials = credentials => {
    const errors = [];
    if (credentials.firstName.trim() === '') {
        errors.push({
            name: 'firstName',
            message: 'First name is required',
        });
    } else if (credentials.firstName.length < 3) {
        errors.push({
            name: 'firstName',
            message: 'Minimal length is 3',
        });
    }

    if (credentials.lastName.trim() === '') {
        errors.push({
            name: 'lastName',
            message: 'Last name is required',
        });
    } else if (credentials.lastName.length < 3) {
        errors.push({
            name: 'lastName',
            message: 'Minimal length is 3',
        });
    }
    return errors;
};

const checkPassword = (password, passwordConfirmation) => {
    const errors = [];
    if (password.trim() === '') {
        errors.push({
            name: 'password',
            message: 'Password is required',
        });
    } else if (password.trim().length < 3) {
        errors.push({
            name: 'password',
            message: 'Password min length is 3 characters',
        });
    } else if (password.trim().length > 16) {
        errors.push({
            name: 'password',
            message: 'Password max length is 16 characters',
        });
    } else if (
        passwordConfirmation !== undefined &&
        password !== passwordConfirmation
    ) {
        errors.push({
            name: 'password',
            message: 'Passwords are not the same',
        });
        errors.push({
            name: 'passwordConfirmation',
            message: 'Passwords are not the same',
        });
    }
    return errors;
};

module.exports = { checkEmail, checkCredentials, checkPassword };
