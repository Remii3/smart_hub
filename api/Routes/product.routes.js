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

router.get('/all', allProducts);
router.get('/shop', shopProducts);
router.get('/auction', auctionProducts);
router.get('/one', oneProduct);
router.get('/searched', searchedProducts);

router.post('/one', addProduct);
router.post('/update', updateProduct);
router.post('/delete', deleteProduct);
module.exports = router;
