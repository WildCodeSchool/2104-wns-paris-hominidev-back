import {IUser} from "../../../interface/interface";
import { PubSub } from 'graphql-subscriptions';
const { ApolloError, AuthenticationError } = require("apollo-server");

const bcrypt = require('bcrypt')
const bubble = require('../../models/bubble.model').BubbleModel;
const genToken = require('../../../utils/genToken');
const pubsub = new PubSub();

const bubble_Resolver = {
    Subscription: {
        postCreated: {
          // More on pubsub below
          subscribe: () => pubsub.asyncIterator(['POST_CREATED']),
        },
      },
}

module.exports = bubble_Resolver