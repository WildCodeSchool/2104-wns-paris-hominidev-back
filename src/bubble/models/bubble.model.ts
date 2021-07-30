import { Schema, model, connect } from 'mongoose';

const bubbleSchema = new Schema({
    url: String,
    createAt: {type: Date, default: Date.now}
});


const BubbleModel = model("Bubble", bubbleSchema);
module.exports = {BubbleModel, bubbleSchema};