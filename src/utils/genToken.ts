const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET;

const generateAccessToken = (user: any, secret:string) => {
    return jwt.sign(user, secret, {expiresIn: 604800});
}
module.exports = generateAccessToken;