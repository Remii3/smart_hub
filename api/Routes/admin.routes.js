const express = require('express');

const router = express.Router();

const {
  getSearchedUsers,
  getOneUser,
} = require('../Controllers/admin.controller.js');
const prepareSearchedUsers = require('../Middleware/admin/prepareSearchedUsers.middleware.js');
const checkSortMethod = require('../Middleware/checkSortMethod.middleware.js');

router.get('/search', prepareSearchedUsers, checkSortMethod, getSearchedUsers);
router.get('/user', getOneUser);

module.exports = router;
