require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        if (username.lenght < 3) {
            return res.status(400).json({ error: 'Username must be at least 3 characters long' });
        }

        if (password.lenght < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

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
        const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
        });

        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, {
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_TIME,
        });
        
        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.log(error)
        error.statusCode = 400
        error.message = 'Login failed'
        next(error)
    }
});

router.post('/refresh', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const { userId } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
            expiresIn: process.env.JWT_TOKEN_EXPIRE_TIME,
        });
        res.status(200).json({ accessToken });
    } catch (error) {
        console.log(error)
        error.statusCode = 403
        error.message = 'Refresh token failed'
        next(error)
    }
});
    
module.exports = router;