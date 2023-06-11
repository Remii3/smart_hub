const express = require('express');

const router = express.Router();
const {
    addProduct,
    getAllProducts,
    getAuctionProducts,
    getShopProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../Controllers/product.controller');

router.get('/all', getAllProducts);
router.get('/shop-products', getShopProducts);
router.get('/auction-products', getAuctionProducts);
router.get('/product', getProduct);

router.post('/product', addProduct);
router.post('/update', updateProduct);
router.post('/delete', deleteProduct);
module.exports = router;
