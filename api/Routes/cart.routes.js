const express = require('express');

const router = express.Router();

const {
  addToCart,
  removeFromCart,
  getCart,
  cartItemDecrement,
  initiatePayment,
  cartItemIncrement,
} = require('../Controllers/cart.controller');

router.get('/all', getCart);

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.post("/increment", cartItemIncrement);
router.post("/decrement", cartItemDecrement);
router.post('/create-payment-intent', initiatePayment);

module.exports = router;
