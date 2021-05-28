const bcrypt =require('bcrypt')
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: {type: String, unique: true},
    password:{type:String}
});

userSchema.pre('save', async function save(this: any, next: any ) {
    if (!this.isModified('password')) return next();
    try {
        const salt = 12
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.validatePassword = async function validatePassword(data: any) {
    return bcrypt.compare(data, this.password);
};
const UserModel = mongoose.model("User", userSchema);
module.exports = {UserModel, userSchema};
