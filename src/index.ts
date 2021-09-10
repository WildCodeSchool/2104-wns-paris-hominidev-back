import * as dotenv from 'dotenv';

import { ApolloServer } from 'apollo-server';
const {userTypeDefs} = require("./auth/graphQl/schema/index")
const resolver = require("./auth/graphQl/resolver")

const dbConnect = require("./auth/config/config.db");
const jwt = require("jsonwebtoken");

dotenv.config();
dbConnect();

const server = new ApolloServer({
    cors:{
        origin:'*',
        credentials:true
    },
    typeDefs: userTypeDefs,
    resolvers: resolver.userResolver,
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

server.listen().then(({url}: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
});

export default server