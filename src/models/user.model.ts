const bcrypt = require('bcrypt')
const mongoose = require("mongoose");

// @ts-ignore
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {
        type: String,
        index: {unique: true}
    },
    password: {type: String},
    isConnected: Boolean!,
    createAt: {
        type: Date,
        default: Date.now
    }
});


const UserModel = mongoose.model("User", userSchema);
module.exports = {UserModel, userSchema};
