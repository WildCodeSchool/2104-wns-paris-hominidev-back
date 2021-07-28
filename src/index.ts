import * as dotenv from 'dotenv';

const {ApolloServer} = require('apollo-server');
const {userTypeDefs} = require("./graphQl/schema/index")
const resolver = require("./graphQl/resolver")
const dbConnect = require("./config//config.db");
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