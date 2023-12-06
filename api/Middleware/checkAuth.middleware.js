const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(200).json({ data: null, message: 'No token entered' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ data: null, message: 'Auth failed' });
  }
};

module.exports = checkAuth;
