const { model, Schema } = require('mongoose');
const Joi = require('joi');


const musicSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    artist: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    coverImage: {
        type: String,
        trim: true,
        required: true
    }
}, { timestamps: true });


const Music = model('Music', musicSchema);

function validateMusic(music) {
    const schema = Joi.object({
        title: Joi.string().min(2).max(50).trim().required(),
        artist: Joi.string().min(2).max(50).trim().required(),
        coverImage: Joi.string().required()
    });

    return schema.validate(music);
}

exports.Music = Music;
exports.validate = validateMusic;