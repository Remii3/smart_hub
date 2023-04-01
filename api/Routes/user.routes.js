const express = require('express');

const router = express.Router();

const checkAuth = require('../Middleware/checkAuth.middleware');

const { signIn, signUp, profile } = require('../Controllers/user.controllers');

router.post('/register', signUp);

router.post('/login', signIn);

router.get('/profile', checkAuth, profile);

module.exports = router;
