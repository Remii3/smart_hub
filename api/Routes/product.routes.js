const express = require('express');

const router = express.Router();

const {
  getBooks,
  getCategories,
} = require('../Controllers/product.controller');

router.get('/books', getBooks);
router.get('/categories', getCategories);

module.exports = router;
