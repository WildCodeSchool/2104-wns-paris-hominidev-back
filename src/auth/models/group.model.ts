import { Schema, model } from 'mongoose';
import {IGroup} from "../../interface/interface";

const groupSchema = new Schema<IGroup>({
    name: String,
    isActive:Boolean,
    formationId: { type: Schema.Types.ObjectId, ref: "Formation" },
    userId:[ { type: Schema.Types.ObjectId, ref: "User" }],
    createAt: {type: Date, default: Date.now}
});
module.exports = model("Group", groupSchema);
