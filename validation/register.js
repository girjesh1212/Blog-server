const Validator = require('validator');
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';
    data.name = !isEmpty(data.name) ? data.name : '';


    if (!Validator.isLength(data.name, { min: 2, max: 20 })) {
        errors.name = 'Name must be between 2 and 20 characters'
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }

    if (!Validator.isLength(data.password, { min: 6 })) {
        errors.password = 'Password must have at least 6 characters'
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password of length at least 6 is required';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords do not match';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}