import { makeExecutableSchema } from '@graphql-tools/schema';
import { bubbleTypeDefs } from './bubble/graphQl/schema';
import { userTypeDefs } from './auth/graphQl/schema';
import {gql} from "apollo-server-express";
 
const Query = gql`
  type Query {
    bubbleTypeDefs(ID: Int!): Post
    userTypeDefs(ID: Int!): Post
  } 
`;

makeExecutableSchema({
  typeDefs: [ Query, bubbleTypeDefs, userTypeDefs ],
  resolvers: {},
});

export default Schema;