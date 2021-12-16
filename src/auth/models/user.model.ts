import {Schema, model, connect} from 'mongoose';
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
    groupId: {type: Schema.Types.ObjectId, ref: "Group"},
    createAt: {type: Date, default: Date.now}
});

module.exports = model("User", userSchema);
