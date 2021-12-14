import {gql} from "apollo-server-express";
import {IUser} from "../../../interface/interface";

export const type_Defs = gql`
    scalar Date
    type Notification { label: String }
    type Message{ message:String }
    type Post{ value:String }

    type ChatMessage{
        message: String!
        userId: String
        roomId:Int
    }

    type BoolAnswer{
        value:Boolean
        student:String
    }
    type Question {
        formerId:ID!
        message:String!
    }
    type User{
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        role:String!
        password:String
        confirmPassword:String!
        groups:Group
    },
    type Promotion{
        id:ID!
        name:String!
        formationId:String!
        promotionId:String!
        userId:String!
    },
    type Group{
        id:ID!
        name:String!
        isActive:Boolean
        formationId:String
        userId:[ID!]
    },
    type Formation{
        id:ID!
        name:String!
    },
    type AuthData{
        id:ID!
        token:String!
        role:String!
        tokenExpiration:Int!
        firstname: String!
        lastname: String!
        email:String!
    }
    input userInput{
        firstname: String!
        lastname: String!
        email: String!
        password:String!
        confirmPassword:String!
    }
    type Query{
        users: [User!]
        getUser(userId:ID!):User!

        formation(formationId:ID!):Formation
        formations:[Formation!]

        group(goupId:ID!):Group!
        groups: [Group!]

        login(email: String!,password: String!):AuthData!
        postMessage(label:String!):Notification
        notifications: [Notification]
    }
    type Mutation {
        createFormation(name:String,):Formation!,
        updateUFormation(id:ID!,name:String):Formation
        deleteFormation(id:ID!):Formation

        createGroup(name:String!,formationId:ID!, userId:[ID!], isActive:Boolean):Group,
        deleteGroup(id:ID!):Group

        registerUser(firstname:String!,lastname:String!,email: String!, password: String!, confirmPassword:String!,role:String!): User!
        updateUser(userId: ID!, userInput: userInput): User
        deleteUser(userId: ID!): User
        pushNotification(label: String!): Notification

        postQuestion(formerID:ID!, message:String!):Question
        createMessage(roomId:Int!, message:String!):ChatMessage!
        goodOrBad(studentId:ID!, value:Boolean):BoolAnswer
    }
    type Subscription {
        newNotification: Notification
        newQuestion:Message
        newBoolAnswer:BoolAnswer
        newRoomMessage(roomId:Int!):ChatMessage
    }
`
