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

module.exports = router;