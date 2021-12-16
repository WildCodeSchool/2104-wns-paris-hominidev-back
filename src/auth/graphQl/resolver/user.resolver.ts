import {Imessage, IUser} from "../../../interface/interface";
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
            return {id: user.id, role: user.role, groupId: user.groupId, token: token}
        },
    },
    Mutation: {
        registerUser: async (parent: any, args: any) => {
            const {firstname, lastname, email, password, confirmPassword, role, group} = args;
            console.log(args.group)
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
                        role: role,
                        groupId: group
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
        createMessage: (parent: any, args: any, context: any) => {
            if (context.authenticatedUserEmail) {
                const data = {
                    userId: context.authenticatedUserEmail.userId,
                    roomId: args.roomId,
                    newRoomMessage: {message: args.message}
                }
                pubsub.publish(NEW_CHANNEL_MESSAGE, data)
                    .then(() => console.log("success"))
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
        },
        postMessage: async (parent: any, args: Imessage, context: any) => {
            if (context.authenticatedUserEmail) {
                let data: Imessage
                data = args
                data && await pubsub.publish('MESSAGE', {message: data})
                console.log(data)
                return data
            }
        }
    },

    Subscription: {
        newNotification: {
            subscribe: () => {
                return pubsub.asyncIterator('FORMER_NOTIFICATION')
            }
        },
        newBoolAnswer: {
            subscribe: withFilter(() => pubsub.asyncIterator('STUDENT_BOOL_ANSWER'),
                (payload, variables, context, info) => {
                    return payload.newBoolAnswer.value
                })
        },
        newRoomMessage: {
            resolve: (payload: any) => {
                const data = {
                    userId: payload.userId,
                    message: payload.newRoomMessage.message,
                    roomId: payload.roomId
                }
                return data
            },
            subscribe: () => {
                return pubsub.asyncIterator(NEW_CHANNEL_MESSAGE)
            }
        },
        message:{
            resolve:(payload:Imessage)=>{
               return {
                       type:payload.message.type,
                       tab:payload.message.tab,
                       url:payload.message.url,
                       group:payload.message.group,
                       data:payload.message.data
               }
            },
            subscribe:()=>{
              return pubsub.asyncIterator('MESSAGE')
            }
        }
    }
}
