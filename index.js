const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const typeDefs = require('./type_defs')
const resolvers = require('./resolvers')
dotenv.config();


const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.h6nlm.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground: {endpoint: 'http://localhost:5000/graphql'}
})
// Connect to the MongoDB cluster
mongoose.connect(
    uri,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true
    },
)
    .then( () => {
        server.listen({ port: 5000 })
            .then(() => console.log('Your Apollo Server is running on port 5000'))
    })
    .catch( () => {
        console.log('Error while connecting to MongoDB');
    })



