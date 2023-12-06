const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json('No token entered');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json('Auth failed');
    }
};

module.exports = checkAuth;
