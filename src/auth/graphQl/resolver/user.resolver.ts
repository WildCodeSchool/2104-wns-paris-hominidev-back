import {IUser} from "../../../interface/interface";
import {PubSub} from "graphql-subscriptions";
import {withFilter} from "apollo-server";

const {AuthenticationError} = require("apollo-server-express");
import bcrypt from 'bcryptjs';
import {Query} from "type-graphql";

const User = require('../../models/user.model');
const Formation = require('../../models/formation.model')
const genToken = require('../../../utils/genToken')

const pubsub = new PubSub();
const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';

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
                    const InvalidGroup = new User({
                        firstname: "null",
                        lastname: "null",
                        role: "null",
                        email: `${email} this account already exist`
                    })
                    console.error({message: `${InvalidGroup.email}`})
                    return InvalidGroup
                } else {
                    if (password != confirmPassword) {
                        const InvalidPassword = new User({
                            firstname: "null",
                            lastname: "null",
                            role: "null",
                            email: 'null',
                            password: "les mots de passe ne corespondent pas"
                        })
                        console.error({message: "password don't match"})
                        return InvalidPassword
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
                }
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
                    await pubsub.publish('FORMER_QUESTION', {newQuestion: {message: message}})
                    return {message: message}
                }
            } catch (e) {
                console.log(e)
            }
        },
        createMessage: (parent: any, args: any, context: any) => {
            if (context.authenticatedUserEmail) {
                const data ={
                    userId: context.authenticatedUserEmail.userId,
                    roomId: args.roomId,
                    newRoomMessage: {message: args.message}
                }
                pubsub.publish(NEW_CHANNEL_MESSAGE, data)
                    .then(() =>console.log("success") )
                return data
            } else {
                return {message: "Vous n'etes pas authentifier"}
            }
        },
        goodOrBad: async (parent: any, args: any, context: any) => {
            const {value} = args
            if (context.authenticatedUserEmail) {
                const userRole = context.authenticatedUserEmail.role
                if (userRole != 4) {
                    return
                } else {
                    const studentId = context.authenticatedUserEmail.userId
                    await pubsub.publish('STUDENT_BOOL_ANSWER', {newBoolAnswer: {value: value, student: studentId}})
                    return {value: value}
                }
            } else {
                return {message: "Vous n'etes pas authentifier"}
            }
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
        },
        newBoolAnswer: {
            subscribe: withFilter(() => pubsub.asyncIterator('STUDENT_BOOL_ANSWER'),
                (payload, variables, context, info) => {
                    return payload.newBoolAnswer.value
                })
        },
        newRoomMessage: {
            resolve:(payload:any)=>{
                const data = {
                    userId:payload.userId,
                    message:payload.newRoomMessage.message,
                    roomId:payload.roomId
                }
                return data
            },
            subscribe:()=> {return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE)}
        }
    }
}
