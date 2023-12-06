const express = require("express");

const router = express.Router();

const {
  cartItemDecrement,
  initiatePayment,
  cartItemIncrement,
  addItemToCart,
  removeItemFromCart,
  getAllCartItems,
} = require("../Controllers/cart.controller");
const preparePostCartItem = require("../Middleware/cart/preparePostCartItem.middleware");

router.get("/all", getAllCartItems);

router.post("/add", preparePostCartItem, addItemToCart);
router.post("/remove", preparePostCartItem, removeItemFromCart);
router.post("/increment", preparePostCartItem, cartItemIncrement);
router.post("/decrement", preparePostCartItem, cartItemDecrement);
router.post("/create-payment-intent", initiatePayment);

module.exports = router;
