import {IUser} from "../../../interface/interface";
import {PubSub} from "graphql-subscriptions";

const {AuthenticationError} = require("apollo-server-express");
const localStorage = require('localStorage')

const bcrypt = require('bcrypt')
const User = require('../../models/user.model').UserModel;
const genToken = require('../../../utils/genToken')

const FORMER_NOTIFICATION = 'newNotifications';

const user_Resolver = {

    Query: {
        postMessage: (parent: any, args: any) => {
            const pubsub = new PubSub();
            const message: string = args
            let newNotification
            if (message) {
                //localStorage.setItem("message", JSON.stringify(message))
                newNotification = {label: message}
                pubsub.publish(FORMER_NOTIFICATION, {newNotification})
                console.log("neeee", newNotification)
            }
            //let test = localStorage.getItem("message")
            // @ts-ignore
            console.log('ici', newNotification.label.value)
            return message
        },
        getUser: async (parent: any, args: any, context: any) => {
            if (context.authenticatedUserEmail) {
                try {
                    const {userId} = args;
                    return await User.findById(userId);
                } catch (error) {
                    throw new Error(error);
                }
            } else {
                throw new AuthenticationError("Invalid auth");
            }
        },
        users: async (parent: any, args: any, context: any) => {
            if (context.authenticatedUserEmail) {
                try {
                    return await User.find();
                } catch (error) {
                    throw new Error(error);
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
            return {id: user.id, token: token}
        },
    },
    Mutation: {
        registerUser: async (parent: any, args: any) => {
            const {id, firstname, lastname, email, password, confirmPassword, role} = args;
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
                throw new Error(error);
            }
        },
        deleteUser: async (parent: any, args: any) => {
            try {
                const {userId} = args;
                return await User.findByIdAndDelete(userId);
            } catch (error) {
                throw new Error(error);
            }
        },
        pushNotification: () => {
            let message = JSON.parse(localStorage.getItem("message"))
            let newNotification
            const pubsub = new PubSub();
            console.log("test", message.value)
            if (message) {
                newNotification = {label: message.value}
                pubsub.publish(FORMER_NOTIFICATION, {newNotification})
            }
            return newNotification;
        },
    },
    Subscription: {
        newNotification: {
            subscribe: () => {
                const pubsub = new PubSub();
                let test = pubsub.asyncIterator(FORMER_NOTIFICATION)
            console.log(test)
            }
        }
    }
}


module.exports = user_Resolver