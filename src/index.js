const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.h6nlm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

try {
    // Connect to the MongoDB cluster
    mongoose.connect(
        uri,
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => console.log(" Mongoose is connected")
    );

} catch (e) {
    console.log("could not connect");
}
