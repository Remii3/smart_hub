const express = require('express');

const router = express.Router();

const {
  getAllUsers,
  getOneUser,
} = require('../Controllers/admin.controller.js');

router.get('/users', getAllUsers);
router.get('/user', getOneUser);

module.exports = router;
