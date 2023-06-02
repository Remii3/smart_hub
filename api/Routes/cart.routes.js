const express = require('express');

const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCart,
  cartItemDecrement,
  cartItemIncrement,
  initiatePayment,
} = require('../Controllers/cart.controller');

router.get('/cart-get', getCart);

router.post('/cart-add', addToCart);
router.post('/cart-remove', removeFromCart);
router.post('/cartItem-increment', cartItemIncrement);
router.post('/cartItem-decrement', cartItemDecrement);

router.post('/create-payment-intent', initiatePayment);

module.exports = router;
