const dateFormat = require('dateformat');
const randomstring = require("randomstring");

const User = require('../models/User');
const { encrypt, decrypt, generateToken } = require('../lib/encryption');
const {
    signup,
    activationCodeVerify,
    activateAccount,
    login,
    forgotPasswordRequest,
    forgotPassword
} = require('../validation/user');

module.exports = {
    findByAttribute(condition) {
        return new Promise(resolve => User.findOne(condition, (error, data) => resolve({ error, data })));
    },
    updateByAttributes(condition, valueObj) {
        return new Promise(resolve => User.updateOne(condition, { $set: valueObj }, (error, data) => resolve({ error, data })))
    },
    activationCodeVerify(code, key) {
        return new Promise(async resolve => {
            const validation = activationCodeVerify({ activationCode: code });
            if (validation.error) return resolve({ error: 'Code cannot be blank.', response: null });

            const { error, data } = await this.findByAttribute({ [key]: code });
            if (error || !data) return resolve({ error: 'Record does not exists', response: null });
            return resolve({ error: null, response: data });
        });
    },
    signup(input) {
        return new Promise(resolve => {
            const validation = signup(input);
            if (validation.error) return resolve({ error: validation.error, message: '', activationCode: '' });

            const now = new Date();
            const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const { fullName, email, type } = validation.value;
            new User({
                fullName,
                email,
                type,
                code: randomstring.generate(32),
                status: 1,
                createdAt: datetime,
                updatedAt: datetime
            }).save(async (error, data) => {
                if (error) {
                    if (error.code && error.code === 11000) {
                        return resolve({
                            error: [{ key: 'email', value: 'Already in used!' }],
                            message: 'Your changes could not be saved',
                            activationCode: ''
                        });
                    } else {
                        return resolve({
                            error: [],
                            message: 'Some thing went wrong!',
                            activationCode: ''
                        });
                    }
                } else {
                    return resolve({ error: null, activationCode: data.code, message: 'Account has been created successfully' });
                }
            });
        });
    },
    activateAccount(input) {
        return new Promise(async resolve => {
            const validation = activateAccount(input);
            if (validation.error) return resolve({ error: validation.error, message: '' });

            const { error } = await this.activationCodeVerify(validation.value.activationCode, 'code');
            if (error) return resolve({ error: [{ key: 'activationCode', value: 'Activation code is invalid' }], message: '' });

            const code = randomstring.generate(32);
            const now = new Date();
            const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const password = encrypt(validation.value.password, code);
            const { error: err } = await this.updateByAttributes({ code: validation.value.activationCode }, { password, code, hasEmailVerified: 1, status: 1, updatedAt: datetime });
            if (err) {
                return resolve({
                    error: [{ key: 'email', value: '' }, { key: 'password', value: '' }, { key: 'confirmPassword', value: '' }],
                    message: 'Some thing went wrong!'
                });
            } else {
                const { error: err, data: res } = await this.findByAttribute({ code });
                return resolve({
                    error: null,
                    message: 'Account actaviated successfully'
                });
            }
        });
    },
    login(input) {
        return new Promise(async resolve => {
            const validation = login(input);
            if (validation.error) return resolve({ error: validation.error, message: '', response: null });

            const { error, data } = await this.findByAttribute({ email: validation.value.email });
            if (error || !data) return resolve({
                error: [{ key: 'email', value: 'Email Address does not exists' }, { key: 'password', value: '' }],
                message: 'User does not exist',
                response: null
            });

            if (decrypt(data.password, data.code) !== validation.value.password) return resolve({
                error: [{ key: 'email', value: '' }, { key: 'password', value: 'Password mismatch' }],
                message: 'Password is incorrect',
                response: null
            });

            return resolve({
                error: null,
                message: 'User logged in successfully',
                response: data,
                jwToken: generateToken(data._id)
            });
        });
    },
    forgotPasswordRequest(input) {
        return new Promise(async resolve => {
            const validation = forgotPasswordRequest(input);
            if (validation.error) return resolve({ error: validation.error, message: '', token: '' });

            const now = new Date();
            const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const { error, data } = await this.findByAttribute({ email: validation.value.email });
            if (error) return resolve({ error: null, message: 'Some thing went wrong!', token: '' });
            if (!error && !data) return resolve({ error: null, message: 'Sorry, Record does not exists', token: '' });
            const forgotPasswordToken = randomstring.generate(32);
            const { error: err } = await this.updateByAttributes({ email: validation.value.email }, { forgotPasswordToken, updatedAt: datetime });
            if (err) return resolve({ error: null, message: 'Some thing went wrong!', token: '' });
            return resolve({ error: null, message: 'Forgot password token generated', token: forgotPasswordToken });
        });
    },
    forgotPassword(input) {
        return new Promise(async resolve => {
            const validation = forgotPassword(input);
            if (validation.error) return resolve({ error: validation.error, message: '' });

            const { error, data } = await this.findByAttribute({ forgotPasswordToken: validation.value.forgotPasswordToken });
            if (error) return resolve({ error: null, message: 'Some thing went wrong!' });
            if (!error && !data) return resolve({ error: null, message: 'Record does not esist.' });
            const now = new Date();
            const datetime = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
            const code = randomstring.generate(32);
            const password = encrypt(validation.value.password, code);
            const { error: err } = await this.updateByAttributes({ _id: data._id }, { password, code, forgotPasswordToken: '', updatedAt: datetime });
            if (err) return resolve({ error: null, message: 'Some thing went wrong!' });
            return resolve({ error: null, message: 'Password has been changed successfully' });
        });
    },
    list() {
        return new Promise(async resolve => {
            const match = { type: { $ne: 'admin' } };
            const { response } = await this.userExec(match);
            return resolve({ response });
        })
    },
    userExec(match) {
        return new Promise(resolve => {
            User.aggregate([
                {
                    $match: match
                },
                {
                    $project: {
                        _id: "$_id",
                        fullName: "$fullName",
                        email: "$email",
                        password: "$password",
                        type: "$type",
                        code: "$code",
                        forgotPasswordToken: "$forgotPasswordToken",
                        hasEmailVerified: "$hasEmailVerified",
                        status: "$status",
                        createdAt: { $dateToString: { format: "%m-%d-%Y", date: "$createdAt" } },
                        updatedAt: { $dateToString: { format: "%m-%d-%Y", date: "$updatedAt" } },
                    }
                }
            ]).exec((error, response) => resolve({ response: error ? [] : response }));
        })
    },
    findUserById(condition) {
        return new Promise(async resolve => {
            const { error, data } = await this.findByAttribute(condition);
            if (error) return resolve({ response: null });
            return resolve({ response: data });
        })
    }
}
