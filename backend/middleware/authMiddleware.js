require('dotenv').config()
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: 'Access denied' });

    const token = req.headers.authorization.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

function verifyRefreshToken(req, res, next) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token is missing' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};


module.exports = {
    verifyToken,
    verifyRefreshToken
}
