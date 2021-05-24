const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},
});
const UserModel = mongoose.model("User", userSchema);
module.exports = {UserModel, userSchema};
