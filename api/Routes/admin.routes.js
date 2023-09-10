const express = require('express');

const router = express.Router();

const { allUsers, oneUser } = require('../Controllers/admin.controller.js');

router.get('/users', allUsers);
router.get('/user', oneUser);

module.exports = router;
