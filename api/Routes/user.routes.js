const express = require('express');

const router = express.Router();
const checkAuth = require('../Middleware/checkAuth.middleware');
const {
  signIn,
  signUp,
  myProfile,
  newData,
  guestData,
  otherUserData,
  addFollow,
  removeFollow,
  getAllAuthors,
  changeSecurityPermissions,
} = require('../Controllers/user.controller');
const checkSignUpData = require('../Middleware/checkSignUpData.middleware');
const checkSignInData = require('../Middleware/checkSignInData.middleware');

router.get("/profile", checkAuth, myProfile);
router.get("/other-profile", otherUserData);
router.get("/guest", guestData);
router.get("/authors", getAllAuthors);
router.get("/admins");

router.post("/register", checkSignUpData, signUp);
router.post("/login", checkSignInData, signIn);
router.post("/update", newData);
router.post("/follow-add", addFollow);
router.post("/follow-remove", removeFollow);

router.post('/security-permission', changeSecurityPermissions);

module.exports = router;
