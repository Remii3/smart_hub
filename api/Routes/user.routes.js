const express = require('express');

const router = express.Router();
const checkAuth = require('../Middleware/checkAuth.middleware');
const {
  login,
  register,
  getMyProfile,
  getOtherProfile,
  getGuestProfile,
  getAllAuthors,
  getAllAdmins,
  addOneFollow,
  removeOneFollow,
  updateOneUser,
  deleteOneUser,
  getFollowedUsers,
} = require('../Controllers/user.controller');
const checkSignUpData = require('../Middleware/checkSignUpData.middleware');
const checkSignInData = require('../Middleware/checkSignInData.middleware');
const userPathUpdate = require('../Middleware/userPathUpdate.middleware');

router.get('/profile', checkAuth, getMyProfile);
router.get('/other-profile', getOtherProfile);
router.get('/guest', getGuestProfile);
router.get('/authors', getAllAuthors);
router.get('/admins', getAllAdmins);
router.get('/followed', getFollowedUsers);

router.post('/login', checkSignInData, login);
router.post('/register', checkSignUpData, register);
router.post('/follow-add', addOneFollow);
router.post('/follow-remove', removeOneFollow);
router.post('/update', userPathUpdate, updateOneUser);
router.post('/delete-one', deleteOneUser);

module.exports = router;
