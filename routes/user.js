const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');


router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        res.send({ _id: user._id, name: user.name, email: user.email });
    } catch (ex) {
        if (ex.code === 11000) {
            res.status(400).send(`User already exists with the given email: ${email}`)
        }
    }
});


router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password -__v');
    res.send(user);
});


module.exports = router;