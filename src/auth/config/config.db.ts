import mongoose from 'mongoose';

const connectToDb = () => {
    const uri =`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@pygmalink.oy8tj.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }).then(() => {
        console.log('mongo is connected');
    });
};

module.exports = connectToDb;
