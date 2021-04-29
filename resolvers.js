const UserModel = require('./models/user')

const resolvers = {
    Query: {
        users: () => UserModel.find()
    }
};

module.exports = resolvers
