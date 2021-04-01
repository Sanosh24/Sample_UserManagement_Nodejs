const Joi = require('@hapi/joi')
    .extend(require('@hapi/joi-date'));

const validate = require('./validate');

const signupSchema = Joi.object({
    fullName: Joi.string().min(3).max(100).required().trim().label('Full name'),
    email: Joi.string().email().required().label('Email Address'),
    type: Joi.string().min(3).max(20).required().trim().label('Profile type'),
});

const activationCodeVerifySchema = Joi.object({
    activationCode: Joi.string().max(32).required().trim().label('Activation Code'),
});

const activateAccountSchema = Joi.object({
    email: Joi.string().email().required().label('Email Address'),
    activationCode: Joi.string().max(32).required().trim().label('Activation Code'),
    password: Joi.string().min(6).max(18).required().trim().label('Password'),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
        language: {
            any: {
                allowOnly: '!!Passwords do not match',
            }
        }
    }).label('Confirm Password')
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().label('Email Address'),
    password: Joi.string().min(6).max(18).required().trim().label('Password')
});

const forgotPasswordRequestSchema = Joi.object({
    email: Joi.string().email().required().label('Email Address')
});

const forgotPasswordSchema = Joi.object({
    forgotPasswordToken: Joi.string().required().trim().label('Resource ID'),
    password: Joi.string().min(6).max(18).required().trim().label('Password'),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
        language: {
            any: {
                allowOnly: '!!Passwords do not match',
            }
        }
    }).label('Confirm Password')
});

const signup = input => validate(input, signupSchema);
const activationCodeVerify = input => validate(input, activationCodeVerifySchema);
const activateAccount = input => validate(input, activateAccountSchema);
const login = input => validate(input, loginSchema);
const forgotPasswordRequest = input => validate(input, forgotPasswordRequestSchema);
const forgotPassword = input => validate(input, forgotPasswordSchema);

module.exports = {
    signup,
    activationCodeVerify,
    activateAccount,
    login,
    forgotPasswordRequest,
    forgotPassword
};