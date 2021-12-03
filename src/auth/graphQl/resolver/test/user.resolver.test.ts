// @ts-ignore
import request from "supertest"
import {userResolver} from "../user.resolver";
import {type_Defs} from "../../schema/type_defs";

const resolver = require('../user.resolver')
const userModel = require("../../../models/user.model")

userModel.find = jest.fn();

describe("user.resolver.getUsers", () => {
    it('should be a function', async () => {
        await expect(typeof resolver.userResolver.Query.getUser).toBe('function')
    });
})