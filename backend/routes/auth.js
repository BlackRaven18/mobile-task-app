require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User(username, hashedPassword);
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.find(username);
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        
        res.status(200).json({ token });
    } catch (error) {
        console.log(error)
        error.statusCode = 400
        error.message = 'Login failed'
        next(error)
    }
});

module.exports = router;