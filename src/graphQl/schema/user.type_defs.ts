const {gql} = require("apollo-server-express");

//graphql user schema
const userTypeDefs = gql`
    type User{
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
        password:String!
    }
    input userInput{
        firstname: String!
        lastname: String!
        email: String!
        password:String!
    }
    type Query{
        getUsers: [User]
        getUser(id:ID!):User
    }

    type Mutation {
        addUser(userInput: userInput): User
        updateUser(userId: ID!, userInput: userInput): User
        deleteUser(userId: ID!): User
    }
`
module.exports={userTypeDefs}