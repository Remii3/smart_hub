const express = require('express');

const router = express.Router();
const {
  addOrder,
  getOrders,
  getOneOrder,
} = require('../Controllers/order.controller');

router.get('/all', getOrders);
router.get('/one', getOneOrder);

router.post('/one', addOrder);

module.exports = router;
