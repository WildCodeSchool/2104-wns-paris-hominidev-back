// @ts-ignore
import request from "supertest"
import server from "../../../index"

const userResolver = require('../user.resolver')
const userModel = require("../../../models/user.model")

userModel.find = jest.fn();

describe("user.resolver.getUsers", () => {
    it('should be a function', async () => {
        await expect(typeof userResolver.Query.getUser).toBe('function')
    });
})