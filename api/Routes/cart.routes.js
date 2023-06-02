const express = require('express');

const router = express.Router();

const {
    addToCart,
    removeFromCart,
    getCart,
    cartItemDecrement,
    cartItemIncrement,
} = require('../Controllers/cart.controller');

router.get('/cart', getCart);

router.post('/cart', addToCart);
router.post('/cart-remove', removeFromCart);
router.post('/cartItem-increment', cartItemIncrement);
router.post('/cartItem-decrement', cartItemDecrement);

module.exports = router;
