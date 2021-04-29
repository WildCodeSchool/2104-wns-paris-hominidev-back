const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    displayName: { type: String, unique: true },
});
module.exports = mongoose.model("User", UserSchema);
