import {ApolloError, UserInputError} from "apollo-server-express";
import {IUser, UserAuthRequest} from "../../interface/interface";
const isAuth = require('../../middleware/is-auth')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model').UserModel;


const user_Resolver = {
    Query: {
        getUser: async (parent: any, args: any, req: UserAuthRequest) => {
            try {
                const {userId} = args;
                return await User.findById(userId);
            } catch (error) {
                console.log("je suis une erreur")
                throw new ApolloError(error);
            }
        },
        // @ts-ignore
        getUsers: async (parent: any, args: any, {isAuth}) => {
            /*if (!isAuth) {
                throw new Error('unAuthenticated')
            }*/
            try {
                return await User.find();
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        // @ts-ignore
        login: async (parent: any, args: any) => {
            const {id, firstname, lastname, email, password}: IUser = args;
            const user = await User.findOne({email: email})
            if (!user) {
                throw new Error('This User does not exist')
            }
            const isEqual = await bcrypt.compare(password, user.password)
            if (!isEqual) {
                throw new Error("Password is incorrect")
            }
            const token = jwt.sign({
                    userId: user.id,
                    email: user.email,
                    password: user.pasword
                }, process.env.SECRET
            );
            return {
                id: user.id,
                firstname: firstname,
                lastname: lastname,
                token: token,
                tokenExpiration: 1
            }
        },
    },
    Mutation: {
        registerUser: async (parent: any, args: any) => {
            const {id, firstname, lastname, email, password, confirmPassword} = args;
            try {
                // @ts-ignore
                const existingUser = await User.findOne({email: email})
                if (existingUser) {
                    throw new Error("user already exist.")
                }
                if (password != confirmPassword) {
                    throw new Error("Password dont match")
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashedPassword
                });
                const result = await user.save();
                return {...result._doc, id: user.id}
            } catch (err) {
                console.log(err)
            }

        },

        updateUser: async (parent: any, args: any) => {
            try {
                const {userId, userInput} = args;
                return await User.findOneAndUpdate(userId, userInput, {new: true});
            } catch (error) {
                throw new ApolloError(error);
            }
        },
        deleteUser: async (parent: any, args: any) => {
            try {
                const {userId} = args;
                return await User.findByIdAndDelete(userId);
            } catch (error) {
                throw new ApolloError(error);
            }
        },

    }
}

module.exports = user_Resolver