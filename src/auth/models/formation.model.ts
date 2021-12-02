import { Schema, model } from 'mongoose';
import {IFormation} from "../../interface/interface";


const formationSchema = new Schema<IFormation>({
    name: String,
    formationId: Number,
    createAt: {type: Date, default: Date.now}
});

module.exports = model("Formation", formationSchema);