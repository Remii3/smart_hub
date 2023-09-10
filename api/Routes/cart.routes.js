const express = require('express');

const router = express.Router();

const {
  cartItemDecrement,
  initiatePayment,
  cartItemIncrement,
  addItemToCart,
  removeItemFromCart,
  allCartItems,
} = require('../Controllers/cart.controller');

router.get('/all', allCartItems);

router.post('/add', addItemToCart);
router.post('/remove', removeItemFromCart);
router.post('/increment', cartItemIncrement);
router.post('/decrement', cartItemDecrement);
router.post('/create-payment-intent', initiatePayment);

module.exports = router;
