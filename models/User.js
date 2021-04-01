const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fullName: { type: String, required: true, min: 3, max: 100 },
    email: { type: String, required: true, unique: true, max: 150 },
    password: { type: String, required: false, max: 150 },
    type: { type: String, max: 20, required: true },
    code: { type: String, max: 32, defaultValue: '' },
    forgotPasswordToken: { type: String, max: 32, defaultValue: '' },
    hasEmailVerified: { type: Number, default: 0 },
    status: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('User', userSchema);