const express = require('express');

const router = express.Router();

const { users, user } = require('../Controllers/admin.controller.js');

router.get('/users', users);
router.get('/user', user);

module.exports = router;
