const express = require('express');

const router = express.Router();

const {
  getCategories,
  addProduct,
  getAllProducts,
  getAuctionProducts,
  getShopProducts,
  getProduct,
} = require('../Controllers/product.controller');

router.get('/all-get', getAllProducts);
router.get('/shop-get', getShopProducts);
router.get('/auction-get', getAuctionProducts);
router.get('/categories-get', getCategories);
router.get('/product-get', getProduct);

router.post('/product-add', addProduct);

module.exports = router;
