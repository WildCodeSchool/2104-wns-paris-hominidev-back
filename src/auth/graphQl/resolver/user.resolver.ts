import {IUser} from "../../../interface/interface";
import {PubSub} from "graphql-subscriptions";
import useFakeTimers = jest.useFakeTimers;
import {withFilter} from "apollo-server";

const {AuthenticationError} = require("apollo-server-express");
const localStorage = require('localStorage')

const bcrypt = require('bcrypt')
const User = require('../../models/user.model');
const genToken = require('../../../utils/genToken')

const FORMER_NOTIFICATION = 'newNotifications';

const pubsub = new PubSub();

export const userResolver = {
    Query: {
        postMessage: (parent: any, args: any, context: any) => {
            if (context.authenticatedUserEmail) {
                const message: any = args
                if (message) {
                    pubsub.publish('FORMER_NOTIFICATION', {newNotification: {label: message.label}})
                }
                return message
            } else {
                throw new AuthenticationError("Invalid auth");
            }
        },
        getUser: async (parent: any, args: any, context: any) => {
            if (context.authenticatedUserEmail) {
                try {
                    const {userId} = args;
                    return await User.findById(userId);
                } catch (error) {
                    console.log(error)
                }
            } else {
                throw new AuthenticationError("Invalid auth");
            }
        },
        users: async (parent: any, args: any, context: any, res: Response) => {
            if (context.authenticatedUserEmail) {
                try {
                    console.log(res)
                    return await User.find();
                } catch (error) {
                    console.log(error)
                }
            } else {
                throw new AuthenticationError("Invalid auth");
            }

        },
        login: async (parent: any, args: any) => {
            const {email, password}: IUser = args;
            const user = await User.findOne({email: email})
            if (!user) {
                throw new Error('This User does not exist')
            }
            const isEqual = await bcrypt.compare(password, user.password)
            if (!isEqual) {
                throw new Error("Password is incorrect")
            }
            const token = genToken({userId: user.id, email: user.email, role: user.role}, process.env.SECRET)
            return {id: user.id, role: user.role, token: token}
        },
    },
    Mutation: {
        registerUser: async (parent: any, args: any) => {
            const {firstname, lastname, email, password, confirmPassword, role} = args;
            try {
                const existingUser = await User.findOne({email: email})
                if (existingUser) {
                    console.log("user existant")/* @todo gerer les erreur*/
                }
                if (password != confirmPassword) {
                    console.log("password don't match")
                }
                const hashedPassword = await bcrypt.hash(password, 12);
                const user = new User({
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    password: hashedPassword,
                    role: role
                });
                const result = await user.save();
                return {msg: "user created", ...result._doc, id: user.id}
            } catch (err) {
                console.log(err)
            }
        },
        updateUser: async (parent: any, args: any) => {
            try {
                const {userId, userInput} = args;
                return await User.findOneAndUpdate(userId, userInput, {new: true});
            } catch (error) {
                console.log(error)
            }
        },
        deleteUser: async (parent: any, args: any) => {
            try {
                const {userId} = args;
                return await User.findByIdAndDelete(userId);
            } catch (error) {
                console.log(error)
            }
        },
        postQuestion: async (parent: any, args: any, context: any) => {
            try {
                const question = args
                const formerID = question.formerID
                const message = question.message
                const user = await User.findById(formerID);
                if (user.role != "1") {
                    return {message: "vous n'etes pas habilité à poser une question "}
                } else {
                    pubsub.publish('FORMER_QUESTION', {newQuestion: {message: message}})
                    return {message: message}
                }
            } catch (e) {
                console.log(e)
            }
        },
        postAnswer: async (parent: any, args: any) => {
        }
    },

    Subscription: {
        newNotification: {
            subscribe: () => {
                return pubsub.asyncIterator('FORMER_NOTIFICATION')
            }
        },
        newQuestion: {
            subscribe: withFilter(() => pubsub.asyncIterator('FORMER_QUESTION'),
                (payload, variables, context, info) => {
                    return context.user.role == 1;
                })
        }
    }
}
