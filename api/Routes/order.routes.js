const express = require('express');

const router = express.Router();
const {
  addOrder,
  allOrders,
  oneOrder,
} = require('../Controllers/order.controller');

router.get('/all', allOrders);
router.get('/one', oneOrder);

router.post('/one', addOrder);

module.exports = router;
