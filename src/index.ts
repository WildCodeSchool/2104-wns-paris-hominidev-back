import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import * as dotenv from 'dotenv';
import Schema from './schema'

const {ApolloServer} = require('apollo-server-express');
const express = require('express');
const {userTypeDefs} = require("./auth/graphQl/schema/index")
const {bubbleTypeDefs} = require("./bubble/graphQl/schema/index")
const authResolver = require("./auth/graphQl/resolver")
const bubbleResolver = require("./bubble/graphQl/resolver")
const dbConnect = require("./auth/config/config.db");
const jwt = require("jsonwebtoken");

dotenv.config();
dbConnect();


(async function () {
    const app = express();

    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs: Schema,
        resolvers: {
            authResolver: authResolver.userResolver,
            bubbleResolver: bubbleResolver.bubbleResolver,
        }
      });

      const cors = {
        origin:'*',
        credentials:true
    }
    
    const server = new ApolloServer({
        cors,
        schema,
    // @ts-ignore
        context:({req})=>{
            const token = req.headers.authorization;
            if (token) {
                let payload;
                try {
                    payload = jwt.verify(token, process.env.SECRET);
                    return { authenticatedUserEmail: payload };
                } catch (err) {}
            }
        }
    });

    await server.start();
    server.applyMiddleware({ app });

    SubscriptionServer.create(
        { schema, execute, subscribe },
        { server: httpServer, path: server.graphqlPath }
    );

    const PORT = 4000;
    httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
 
}) ();