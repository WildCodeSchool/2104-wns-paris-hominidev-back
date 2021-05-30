const {userTypeDefs} = require("./graphQl/schema/index")
const resolver = require("./controller/resolver/index")
const UserModel = require("./models/user.model")

const {ApolloServer} = require('apollo-server');
const dbConnect = require("./config//config.db");
import * as dotenv from 'dotenv';

dotenv.config();
dbConnect();

const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: resolver.userResolver,
    context: () => {
    }
});
server.listen().then(({url}: { url: string }) => {
    console.log(`🚀  Server ready at ${url}`);
});