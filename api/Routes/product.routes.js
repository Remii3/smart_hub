const express = require('express');

const router = express.Router();

const {
  getCategories,
  addProduct,
  getAllBooks,
  getAuctionBooks,
  getShopBooks,
} = require('../Controllers/product.controller');

router.get('/all-books', getAllBooks);
router.get('/shop-books', getShopBooks);
router.get('/auction-books', getAuctionBooks);

router.get('/categories', getCategories);

router.post('/add-product', addProduct);

module.exports = router;
