const express = require('express');

const router = express.Router();
const {
  addProduct,
  updateProduct,
  deleteProduct,
  allProducts,
  shopProducts,
  auctionProducts,
  oneProduct,
  searchedProducts,
} = require('../Controllers/product.controller');
const productSearchVerification = require('../Middleware/productSearchVerification.middleaware');

router.get('/all', allProducts);
router.get('/shop', shopProducts);
router.get('/auction', auctionProducts);
router.get('/one', oneProduct);
router.get('/searched', productSearchVerification, searchedProducts);

router.post('/one', addProduct);
router.post('/update', updateProduct);
router.post('/delete', deleteProduct);
module.exports = router;
