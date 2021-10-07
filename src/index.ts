import * as dotenv from 'dotenv';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
const {ApolloServer} = require('apollo-server-express');
const express = require('express');
import {Request} from "express";
import {SubscriptionServer} from 'subscriptions-transport-ws';
import {makeExecutableSchema} from "graphql-tools";
import {execute, subscribe} from 'graphql';
import {createServer} from 'http';

import { type_Defs } from "./auth/graphQl/schema/type_defs";

import {userResolver} from "./auth/graphQl/resolver/user.resolver";
import { formationResolver } from './auth/graphQl/resolver/formation.resolver';
import { GroupResolver } from './auth/graphQl/resolver/group.resolver';

const PORT = 4000;

const dbConnect = require("./auth/config/config.db");
const jwt = require("jsonwebtoken");
dotenv.config();
dbConnect();
(async function () {
    const app = express();
    const httpServer = createServer(app);

    const schema = makeExecutableSchema({
        typeDefs:type_Defs,
        resolvers:[userResolver,GroupResolver, formationResolver],
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

        context: ({req}:{req:Request}) => {
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