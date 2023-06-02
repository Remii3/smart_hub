const express = require('express');

const router = express.Router();
const {
    addProduct,
    getAllProducts,
    getAuctionProducts,
    getShopProducts,
    getProduct,
} = require('../Controllers/product.controller');

router.get('/all', getAllProducts);
router.get('/shop-products', getShopProducts);
router.get('/auction-products', getAuctionProducts);
router.get('/product', getProduct);

router.post('/product', addProduct);

module.exports = router;
