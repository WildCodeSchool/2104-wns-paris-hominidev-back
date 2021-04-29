const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
  _id: ID
    firstname: String
    lastname: String
    email: String
  }
  type Query {
    users: [User]
  }`;

module.exports = typeDefs
