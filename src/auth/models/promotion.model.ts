import { Schema, model, connect } from 'mongoose';
import {IPromotion} from "../../interface/interface";


const promtionSchema = new Schema<IPromotion>({
    name: String,
    formationId: Number,
    promotionId: Number,
    userId: Number,
    createAt: {type: Date, default: Date.now}
});

const UserModel = model("User", promtionSchema);
module.exports = {UserModel, promtionSchema};
