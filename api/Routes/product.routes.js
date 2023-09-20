const express = require('express');

const router = express.Router();
const {
  getAllProducts,
  getShopProducts,
  getAuctionProducts,
  getOneProduct,
  getSearchedProducts,
  addOneProduct,
  updateOneProduct,
  deleteOneProduct,
} = require('../Controllers/product.controller');
const productSearchVerification = require('../Middleware/productSearchVerification.middleaware');

router.get('/all', getAllProducts);
router.get('/shop', getShopProducts);
router.get('/auction', getAuctionProducts);
router.get('/one', getOneProduct);
router.get('/searched', productSearchVerification, getSearchedProducts);

router.post('/one', addOneProduct);
router.post('/update', updateOneProduct);
router.post('/delete', deleteOneProduct);
module.exports = router;
