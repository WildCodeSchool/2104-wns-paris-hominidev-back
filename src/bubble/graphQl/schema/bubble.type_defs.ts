import {gql} from "apollo-server-express";

//graphql bubble schema
// To be done right
const bubbleTypeDefs = gql`
    scalar Date
    type Bubble {
        id: ID!
        url: String!
        createAt: Date!
    }
`
module.exports={bubbleTypeDefs}