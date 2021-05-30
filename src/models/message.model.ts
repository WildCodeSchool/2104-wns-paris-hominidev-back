// @ts-ignore
const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
    body: String,
    username: String,
    createdAt: {type:Date,default:Date.now},
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});