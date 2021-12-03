import * as dotenv from "dotenv";

const mongoose = require("mongoose")

import {userResolver} from "../user.resolver";
import {type_Defs} from "../../schema/type_defs";
import bcrypt from "bcryptjs";

const dbConnect = require("../../../config/config.db");

const resolver = require('../user.resolver')
const userModel = require("../../../models/user.model")

userModel.find = jest.fn();
dotenv.config();

const testUser = {
    email: "ali@gmail.com",
    password: "ali123"
}
let authenticatedUserEmail: Boolean

beforeAll(async () => {
    const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@pygmalink.oy8tj.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`;
    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    }).then(() => {
        console.log('mongo is connected');
    });
})
afterAll(async () => {
     await mongoose.disconnect()
})

describe("user.resolver.getUsers", () => {
    it('getUser should be a function', async () => {
        await expect(typeof resolver.userResolver.Query.getUser).toBe('function')
    });
})

describe("user.resolver.goodOrBad", () => {
    it('goodOrBad should be a function', async () => {
        await expect(typeof resolver.userResolver.Mutation.goodOrBad).toBe('function')
    });
})
describe("user.resolver.login", () => {
    it('login should be a function', async () => {
        await expect(typeof resolver.userResolver.Query.login).toBe('function')
    });
    it("user can be log", async () => {
        const user = await userModel.findOne({email: "ali@gmail.com"})
        const isEqual = await bcrypt.compare(testUser.password, user.password)
        expect(isEqual).toEqual(true)
    })
})
describe("notification", () => {
    it('postMessage should be a function', async () => {
        authenticatedUserEmail &&
        await expect(typeof resolver.userResolver.Query.postMessage).toBe('function')
    });
})
