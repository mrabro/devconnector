const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skills = !isEmpty(data.skills) ? data.skills : '';

    if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.handle = "Handle needs to be between 2 and 40";
    }
    if (Validator.isEmpty(data.handle)) {
        errors.handle = "Profile handle is required";
    }
    if (Validator.isEmpty(data.status)) {
        errors.status = "Profile status is required";
    }
    if (Validator.isEmpty(data.skills)) {
        errors.skills = "Profile skills is required";
    }
    if (!isEmpty(data.website)) {
        if (!Validator.isURL(data.website)) {
            errors.website = "Website is not a valid URL";
        }
    }
    if (!isEmpty(data.youtube)) {
        if (!Validator.isURL(data.youtube)) {
            errors.youtube = "youtube is not a valid URL";
        }
    }
    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = "facebook is not a valid URL";
        }
    }
    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = "instagram is not a valid URL";
        }
    }
    if (!isEmpty(data.linkedin)) {
        if (!Validator.isURL(data.linkedin)) {
            errors.linkedin = "linkedin is not a valid URL";
        }
    }
    if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = "twitter is not a valid URL";
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}