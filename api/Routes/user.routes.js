const express = require('express');

const router = express.Router();

const checkAuth = require('../Middleware/checkAuth.middleware');
const {
  signIn,
  signUp,
  profile,
  newData,
  guestData,
  otherUserData,
  addFollow,
  removeFollow,
} = require('../Controllers/user.controller');
const checkSignUpData = require('../Middleware/checkSignUpData.middleware');
const checkSignInData = require('../Middleware/checkSignInData.middleware');

router.get('/profile', checkAuth, profile);
router.get('/guest', guestData);
router.get('/otherUser', otherUserData);

router.post('/register', checkSignUpData, signUp);
router.post('/login', checkSignInData, signIn);
router.post('/newData', newData);
router.post('/add-follow', addFollow);
router.post('/remove-follow', removeFollow);

module.exports = router;
