const express = require('express');

const router = express.Router();

const checkAuth = require('../Middleware/checkAuth.middleware');

const {
  signIn,
  signUp,
  profile,
  newData,
} = require('../Controllers/account.controllers');

router.post('/register', signUp);

router.post('/login', signIn);

router.get('/profile', checkAuth, profile);

router.post('/newData', newData);

module.exports = router;
