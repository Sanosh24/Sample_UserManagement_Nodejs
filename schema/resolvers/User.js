const { user } = require('../../lib')

module.exports = {
  Mutation: {
    signup: (_, args) => new Promise(async resolve => {
      const response = await user.signup(args.input);
      return resolve(response);
    }),
    activateAccount: (_, args) => new Promise(async resolve => {
      const response = await user.activateAccount(args.input);
      return resolve(response);
    }),
    logIn: (_, args) => new Promise(async resolve => {
      const response = await user.login(args.input);
      return resolve(response);
    }),
    forgotPasswordRequest: (_, args) => new Promise(async resolve => {
      const response = await user.forgotPasswordRequest(args.input);
      return resolve(response);
    }),
    forgotPassword: (_, args) => new Promise(async resolve => {
      const response = await user.forgotPassword(args.input);
      return resolve(response);
    })
  },
  Query: {
    userList: () => new Promise(async resolve => {
      const response = await user.list();
      return resolve(response);
    }),
    findUserById: (_, args) => new Promise(async resolve => {
      const response = await user.findUserById({ _id: args._id });
      return resolve(response);
    })
  }
}
