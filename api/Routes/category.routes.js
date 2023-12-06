const express = require('express');
const {
  getAllCategories,
  addOneCategory,
} = require('../Controllers/category.controller');

const router = express.Router();

router.get('/all', getAllCategories);

router.post('/one', addOneCategory);

module.exports = router;
