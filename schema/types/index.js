const { mergeTypes } = require('merge-graphql-schemas');
const User = require('./User');

const types = [
    User
];
module.exports = mergeTypes(types);
