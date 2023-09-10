const express = require('express');

const router = express.Router();
const {
  addProduct,
  getAllProducts,
  getAuctionProducts,
  getShopProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
  getSearchedProducts,
} = require('../Controllers/product.controller');

router.get('/all', getAllProducts);
router.get("/shop", getShopProducts);
router.get("/auction", getAuctionProducts);
router.get("/one", getOneProduct);
router.get('/searched', getSearchedProducts);

router.post("/one", addProduct);
router.post('/update', updateProduct);
router.post('/delete', deleteProduct);
module.exports = router;
