import {Request} from "express";

export interface IUser {
    id:number
    firstname: string
    lastname: string
    email: string
    password: string
    confirmPassword: string
}
export interface UserAuthRequest extends Request {
    isAuth: boolean
    userId:number
}
