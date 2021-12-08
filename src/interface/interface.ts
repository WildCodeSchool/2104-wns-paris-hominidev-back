import { Schema } from 'mongoose';

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    avatar: string;
    role:string
}

export interface IPromotion{
    name:string
    fomrmationId:number
    promotionId:number
    userId:number
}
export interface IGroup{
    name:string
    isActive:boolean
    fomrmationId:{type: Schema.Types.ObjectId, ref:"Formation"}
    userId:{type: Schema.Types.ObjectId,ref:"User"}
}
export interface IFormation{
    name:string
}