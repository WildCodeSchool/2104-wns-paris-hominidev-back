const User = require('../../models/user.model').UserModel

module.exports={
    Query: {
        getUser: async (parent:any, args:any) => {
            try {
                const { userId } = args;
                return await User.findById(userId);
            } catch (error) {
                throw new Error(error);
            }
        },
        getUsers: async (parent:any, args:any) => {
            try {
                return await User.find();
            } catch (error) {
                throw new Error(error);
            }
        },
    },
    Mutation:{
        addUser: async (parent:any, args:any) => {
            try {
                const { userInput } = args;
                return await User.create(userInput);
            } catch (error) {
                throw new Error(error);
            }
        },
        updateUser: async (parent:any, args:any) => {
            try {
                const { userId, userInput } = args;
                return await User.findOneAndUpdate(userId, userInput, { new: true });
            } catch (error) {
                throw new Error(error);
            }
        },
        deleteUser: async (parent:any, args:any) => {
            try {
                const { userId } = args;
                return await User.findByIdAndDelete(userId);
            } catch (error) {
                throw new Error(error);
            }
        },

    }
}