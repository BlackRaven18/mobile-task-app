const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.use((err, req, res, next) => {
    console.error(err); // Logujemy szczegóły błędu dla siebie
    const status = err.statusCode || 500; // Domyślnie 500, jeśli statusCode nie jest ustawiony
    res.status(status).json({
        error: err.message || 'Internal Server Error'
    });
});

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

router.post('/login', async (req, res) => {
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
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        console.log(token);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;