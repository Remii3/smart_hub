const express = require('express');

const router = express.Router();

const {
  cartItemDecrement,
  initiatePayment,
  cartItemIncrement,
  addItemToCart,
  removeItemFromCart,
  getAllCartItems,
} = require('../Controllers/cart.controller');

router.get('/all', getAllCartItems);

router.post('/add', addItemToCart);
router.post('/remove', removeItemFromCart);
router.post('/increment', cartItemIncrement);
router.post('/decrement', cartItemDecrement);
router.post('/create-payment-intent', initiatePayment);

module.exports = router;
