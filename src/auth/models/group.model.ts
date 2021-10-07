import { Schema, model } from 'mongoose';
import {IGroup} from "../../interface/interface";
const userSchema = require('../models/user.model').UserModel;

const groupSchema = new Schema<IGroup>({
    name: String,
    isActive:Boolean,
    formationId: { type: Schema.Types.ObjectId, ref: "Formation" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    users:{type:[ userSchema]},
    createAt: {type: Date, default: Date.now}
});
module.exports = model("Group", groupSchema);
