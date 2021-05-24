const {gql} = require("apollo-server");

//graphql schema
module.exports=gql`
    type User{
        id: ID!
        firstname: String!
        lastname: String!
        email: String!
    }
    input userInput{
        firstname: String!
        lastname: String!
        email: String!
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
