const express = require('express');

const router = express.Router();

const { signIn, signUp } = require('../controllers/user');

router.post('/register', signUp);

router.post('/login', signIn);

router.post('/logout', (req, res) => {
  res.json('logout');
});

module.exports = router;
