//const mongoose = require("mongoose");
import { Schema, model, connect } from 'mongoose';
import {IUser} from "../../interface/interface";

enum role {
    "pygma admin",
    "campus manager",
    "lead instructor",
    "instructor",
    "student"
}

const userSchema = new Schema<IUser>({
    firstname: String,
    lastname: String,
    email: {type: String, index: {unique: true}},
    password: {type: String},
    avatar: String,
    role: {type: role, default: role.student},
    createAt: {type: Date, default: Date.now}
});


const UserModel = model("User", userSchema);
module.exports = {UserModel, userSchema};
