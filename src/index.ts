import * as dotenv from 'dotenv';

import {makeExecutableSchema} from "graphql-tools";
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import {createServer} from 'http';
import {execute, subscribe} from 'graphql';
import {SubscriptionServer} from 'subscriptions-transport-ws';

const express = require('express');
const {ApolloServer, gql} = require('apollo-server-express');
const {userTypeDefs} = require("./auth/graphQl/schema/index")
const resolver = require("./auth/graphQl/resolver")
const PORT = 4000;

const dbConnect = require("./auth/config/config.db");
const jwt = require("jsonwebtoken");

dotenv.config();
dbConnect();

(async function () {
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs:userTypeDefs,
        resolvers:resolver.userResolver,
    });
    const server = new ApolloServer({
        cors: {
            origin: '*',
            credentials: true
        },
        schema,
        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionServer.close();
                        }
                    };
                }
            },
            ApolloServerPluginDrainHttpServer({httpServer})
        ],

        // @ts-ignore
        context: ({req}) => {
            const token = req.headers.authorization;
            if (token) {
                let payload;
                try {
                    payload = jwt.verify(token, process.env.SECRET);
                    return {authenticatedUserEmail: payload};
                } catch (err) {console.log(err)}
            }
        }

    });
    const subscriptionServer = SubscriptionServer.create(
        {schema, execute, subscribe},
        {server: httpServer, path: server.graphqlPath}
    );

    await server.start();
    server.applyMiddleware({app});

    httpServer.listen(PORT, () =>
        console.log(`🚀 Server is now running on http://localhost:${PORT}/graphql`)
    );
})();