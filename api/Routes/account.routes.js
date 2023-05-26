const express = require('express');

const router = express.Router();

const checkAuth = require('../Middleware/checkAuth.middleware');
const {
  signIn,
  signUp,
  profile,
  newData,
  guestData,
} = require('../Controllers/account.controllers');

router.get('/profile', checkAuth, profile);
router.get('/guest', guestData);

router.post('/register', signUp);
router.post('/login', signIn);
router.post('/newData', newData);

module.exports = router;
