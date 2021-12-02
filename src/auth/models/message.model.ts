// @ts-ignore
const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
    body: String,
    createdAt: {type:Date,default:Date.now},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});