import {gql} from "apollo-server-express";

//graphql user schema
const userTypeDefs = gql`
    scalar Date
    type User {
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        role:String!
        password:String
        confirmPassword:String!
    }
    type AuthData{
        id:ID!
        token:String!
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
        login(email: String!,password: String!):AuthData!
    }

    type Mutation {
        registerUser(firstname:String!,lastname:String!,email: String!, password: String!, confirmPassword:String!,role:String!): User!
        updateUser(userId: ID!, userInput: userInput): User
        deleteUser(userId: ID!): User
        
    }
`
module.exports={userTypeDefs}