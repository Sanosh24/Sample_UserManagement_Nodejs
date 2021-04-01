const { mergeResolvers } = require('merge-graphql-schemas')

const user = require('./User');

const resolvers = [
    user
];

module.exports = mergeResolvers(resolvers);
