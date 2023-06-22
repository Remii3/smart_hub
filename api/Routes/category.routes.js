const express = require('express');
const {
  getAllCategories,
  addCategory,
} = require('../Controllers/category.controller');

const router = express.Router();

router.get('/all', getAllCategories);
router.post('/add', addCategory);

module.exports = router;
