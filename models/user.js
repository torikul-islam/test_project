const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
        trim: true
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email }, config.get('jwtSecret'));
    return token;
}


const User = mongoose.model('User', userSchema);

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required().trim(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required().trim()
    });

    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;