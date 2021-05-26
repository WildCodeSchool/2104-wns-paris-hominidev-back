const {typeDefs} = require("./graphQl/schema/index")
const resolver = require("./controller/resolver/user.resolver")

const {ApolloServer} = require('apollo-server');
const dbConnect = require("./config//config.db");
import * as dotenv from 'dotenv';

dotenv.config();
dbConnect();

const server = new ApolloServer({
    typeDefs:typeDefs,
    resolvers:resolver
});

server.listen().then(({url}:{url:string}) => {
    console.log(`🚀  Server ready at ${url}`);
});
