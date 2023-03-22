const express = require('express');

const router = express.Router();

const { signIn, signUp } = require('../Controllers/user.controllers');
const checkAuth = require('../Middleware/checkAuth.middleware');

router.post('/register', signUp);

router.post('/login', signIn);

router.get('/me', checkAuth, (req, res) => {
  res.json('me');
});

router.post('/logout', (req, res) => {
  res.json('logout');
});

module.exports = router;
