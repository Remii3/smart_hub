const express = require('express');
const {
  addCategory,
  allCategories,
  oneCategory,
} = require('../Controllers/category.controller');

const router = express.Router();

router.get('/all', allCategories);
router.get('/one', oneCategory);

router.post('/one', addCategory);

module.exports = router;
