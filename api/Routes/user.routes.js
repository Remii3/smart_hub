const express = require('express');

const router = express.Router();
const checkAuth = require('../Middleware/checkAuth.middleware');
const {
  myProfile,
  otherProfile,
  guestProfile,
  allAuthors,
  allAdmins,
  login,
  register,
  updateUser,
  addFollow,
  removeFollow,
} = require('../Controllers/user.controller');
const checkSignUpData = require('../Middleware/checkSignUpData.middleware');
const checkSignInData = require('../Middleware/checkSignInData.middleware');
const userPathUpdate = require('../Middleware/userPathUpdatemiddleware');

router.get('/profile', checkAuth, myProfile);
router.get('/other-profile', otherProfile);
router.get('/guest', guestProfile);
router.get('/authors', allAuthors);
router.get('/admins', allAdmins);

router.post('/login', checkSignInData, login);
router.post('/register', checkSignUpData, register);
router.post('/follow-add', addFollow);
router.post('/follow-remove', removeFollow);
router.post('/update', userPathUpdate, updateUser);

module.exports = router;
