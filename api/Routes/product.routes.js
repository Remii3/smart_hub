const express = require('express');

const router = express.Router();

const { getBooks } = require('../Controllers/product.controller');

router.get('/books', getBooks);

module.exports = router;
