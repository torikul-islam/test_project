const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { User } = require('../models/user');


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;



    try {
        let user = await User.findOne({ email: email });
        if (!user) return res.status(400).send('Invalid email or password.');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');

        const token = user.generateAuthToken();

        res.send({ token });

    } catch (ex) {
        if (ex.code === 11000) {
            res.status(400).send(`User already exists with the given email: ${email}`)
        }
    }
});


function validate(req) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email().trim(),
        password: Joi.string().min(5).max(255).required().trim()
    });

    return schema.validate(req);
}

module.exports = router;