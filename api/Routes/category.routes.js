const express = require('express');
const { getAllCategories } = require('../Controllers/category.controller');

const router = express.Router();

router.get('/all', getAllCategories);

module.exports = router;
