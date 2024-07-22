const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ error: 'Login failed' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ error: 'Login failed' });
        }
        const token = jwt.sign({ _id: user._id, userType: user.userType }, process.env.JWT_SECRET);
        res.send({ token, userType: user.userType });
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;