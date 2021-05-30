const {gql} = require("apollo-server-express");

//graphql user schema
const userTypeDefs = gql`
    scalar Date
    type User{
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password:String
    }
    type AuthData{
        id:ID!
        token:String!
        tokenExpiration:Int!
    }
    input userInput{
        firstname: String!
        lastname: String!
        email: String!
        password:String!
    }
    type Query{
        getUsers: [User]
        getUser(id:ID!):User!
        login(email: String!,password: String!):AuthData!
    }

    type Mutation {
        registerUser(firstname:String!,lastname:String!,email: String!, password: String!): User!
        updateUser(userId: ID!, userInput: userInput): User
        deleteUser(userId: ID!): User
        
    }
`
module.exports={userTypeDefs}